import uvicorn
from fastapi import FastAPI, Request, Body
from pydantic import BaseModel
from typing import List, Optional
import requests
import logging
from fastapi.responses import JSONResponse
import tempfile
import subprocess
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_review_service")

app = FastAPI()

# Adjust this if your Ollama server is running elsewhere
OLLAMA_URL = "http://localhost:11434/api/generate"
LLAMA3_MODEL = "llama3"

class ReviewRequest(BaseModel):
    language: str
    code: str

class Suggestion(BaseModel):
    line: int
    message: str
    severity: Optional[str] = None
    fix: Optional[str] = None

class ReviewResponse(BaseModel):
    suggestions: List[Suggestion]

class CompileRequest(BaseModel):
    language: str
    code: str

class CompileResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int

PROMPT_TEMPLATE = (
    """
    You are an expert code reviewer. Analyze the following {language} code and return a JSON array of suggestions.
    Each suggestion should have:
    - line: the 1-based line number
    - message: a short description of the issue or improvement
    - severity: info, warning, or error (optional)
    - fix: the corrected code for that line (optional, only if a fix is obvious)

    Example:
    [
      {{"line": 2, "message": "Use 'map' instead of 'for' loop", "severity": "info", "fix": "result = [x*2 for x in arr]"}}
    ]

    Only return the JSON array, nothing else.

    Code:
    ---
    {code}
    ---
    """
)

def call_ollama(prompt: str) -> str:
    payload = {
        "model": LLAMA3_MODEL,
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        return response.json()["response"]
    except Exception as e:
        logger.error(f"Ollama call failed: {e}")
        raise

@app.post("/review", response_model=ReviewResponse)
async def review_code(req: ReviewRequest):
    logger.info(f"Received review request for language={req.language}")
    prompt = PROMPT_TEMPLATE.format(language=req.language, code=req.code)
    try:
        ollama_response = call_ollama(prompt)
    except Exception as e:
        return JSONResponse(status_code=500, content={"suggestions": [], "error": str(e)})
    # Try to extract the JSON array from the response
    import json, re
    match = re.search(r'\[.*\]', ollama_response, re.DOTALL)
    if not match:
        logger.warning("No JSON array found in Ollama response.")
        return {"suggestions": []}
    try:
        suggestions = json.loads(match.group(0))
        # Validate/normalize suggestions
        for s in suggestions:
            s.setdefault("severity", None)
            s.setdefault("fix", None)
        return {"suggestions": suggestions}
    except Exception as e:
        logger.error(f"Failed to parse suggestions: {e}")
        return {"suggestions": []}

@app.post("/compile", response_model=CompileResponse)
async def compile_code(req: CompileRequest = Body(...)):
    logger.info(f"Received compile request for language={req.language}")
    if req.language.lower() == "python":
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
            f.write(req.code)
            filename = f.name
        try:
            result = subprocess.run([
                "python3", filename
            ], capture_output=True, text=True, timeout=10)
            return CompileResponse(
                stdout=result.stdout,
                stderr=result.stderr,
                exit_code=result.returncode
            )
        except Exception as e:
            logger.error(f"Python execution failed: {e}")
            return CompileResponse(stdout="", stderr=str(e), exit_code=1)
        finally:
            os.remove(filename)
    elif req.language.lower() == "c":
        with tempfile.TemporaryDirectory() as tmpdir:
            src_path = os.path.join(tmpdir, "main.c")
            exe_path = os.path.join(tmpdir, "main.out")
            with open(src_path, "w") as f:
                f.write(req.code)
            try:
                compile_res = subprocess.run([
                    "gcc", src_path, "-o", exe_path
                ], capture_output=True, text=True, timeout=10)
                if compile_res.returncode != 0:
                    return CompileResponse(stdout="", stderr=compile_res.stderr, exit_code=compile_res.returncode)
                run_res = subprocess.run([
                    exe_path
                ], capture_output=True, text=True, timeout=5)
                return CompileResponse(
                    stdout=run_res.stdout,
                    stderr=run_res.stderr,
                    exit_code=run_res.returncode
                )
            except Exception as e:
                logger.error(f"C execution failed: {e}")
                return CompileResponse(stdout="", stderr=str(e), exit_code=1)
    else:
        return CompileResponse(stdout="", stderr="Unsupported language", exit_code=1)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001) 