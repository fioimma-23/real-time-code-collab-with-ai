import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplyTheme } from "../hooks/useApplyTheme";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Play, MessageCircle, Users, Settings,
  Share2, FileText, X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFileById, updateFileContent } from "../redux/Slices/fileSlice";
import { RootState, AppDispatch } from "../redux/store";
import { useFileSocket } from "../hooks/useFileSocket";
import axios from "axios";

// Add a type for AI suggestions
interface AISuggestion {
  line: number;
  message: string;
  severity?: string;
  fix?: string; // replacement code for the line
}

const EditorPage = () => {
  const { projectId, fileId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  useApplyTheme();
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const decorationIdsRef = useRef<string[]>([]);

  const currentUser = "Ananya";
  const [lineEditors, setLineEditors] = useState<{ [line: number]: string }>({});
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [autosave, setAutosave] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [collaborators] = useState<string[]>(["Ananya", "Ajay", "Sai"]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(false);

  const { activeFile, loading } = useSelector((state: RootState) => state.file);
  const content = activeFile?.content || "";
  const [localCode, setLocalCode] = useState("");

  const { emitFileUpdate } = useFileSocket(projectId!, fileId!);

  useEffect(() => {
    if (projectId && fileId) {
      dispatch(fetchFileById({ projectId, fileId }));
    }
  }, [projectId, fileId, dispatch]);

  useEffect(() => {
    setLocalCode(content);
  }, [content]);

  const editorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e: any) => {
      const line = e.position.lineNumber;
      setLineEditors((prev) => ({ ...prev, [line]: currentUser }));
    });
  };

  // Keep the original useEffect for lineEditors decorations
  useEffect(() => {
    if (!monaco || !editorRef.current) return;
    const userDecorations = Object.entries(lineEditors).map(([line, user]) => ({
      range: new monaco.Range(Number(line), 1, Number(line), 1),
      options: {
        isWholeLine: false,
        after: {
          contentText: `👤 ${user}`,
          inlineClassName: "inline-user-label",
        },
      },
    }));
    editorRef.current.deltaDecorations([], userDecorations);
  }, [lineEditors, monaco]);

  // Separate useEffect for AI suggestions decorations
  useEffect(() => {
    if (!monaco || !editorRef.current) return;
    // Remove old AI suggestion decorations
    decorationIdsRef.current = editorRef.current.deltaDecorations(
      decorationIdsRef.current,
      []
    );
    if (!aiSuggestions || aiSuggestions.length === 0) return;
    // Map suggestions to Monaco decorations
    const aiDecorations = aiSuggestions.map((sugg) => {
      const line = sugg.line || 1;
      return {
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          inlineClassName: "ai-suggestion-underline",
          glyphMarginClassName: "ai-suggestion-glyph",
          hoverMessage: { value: sugg.message },
        },
      };
    });
    decorationIdsRef.current = editorRef.current.deltaDecorations(
      decorationIdsRef.current,
      aiDecorations
    );
  }, [aiSuggestions, monaco]);

  const handleRun = () => {
    if (localCode.includes('printf("Hello, world!')) {
      alert("Hello, world!");
    } else {
      alert("Code ran successfully.");
    }
  };

  const handleChange = (value: string | undefined) => {
    const updated = value || "";
    setLocalCode(updated);
    dispatch(updateFileContent({ fileId: fileId!, content: updated }));
    emitFileUpdate(updated);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, `${currentUser}: ${input}`]);
      setInput("");
    }
  };

  const handleAIReview = async () => {
    setAiLoading(true);
    try {
      const res = await axios.post("/ai/review", {
        language: "python", // TODO: dynamically set language
        code: localCode,
      });
      setAiSuggestions(res.data.suggestions || []);
    } catch (err) {
      setAiSuggestions([]);
      // Optionally show error
    }
    setAiLoading(false);
  };

  // Function to jump to a line in the editor
  const jumpToLine = (line: number) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
    }
  };

  // Handler to ignore a suggestion
  const handleIgnoreSuggestion = (idx: number) => {
    setAiSuggestions((prev) => prev.filter((_, i) => i !== idx));
  };
  // Handler to apply a suggestion (if fix is present)
  const handleApplySuggestion = (sugg: AISuggestion, idx: number) => {
    if (!sugg.fix) return;
    const codeLines = localCode.split("\n");
    // Replace the line (1-based index)
    codeLines[sugg.line - 1] = sugg.fix;
    const newCode = codeLines.join("\n");
    setLocalCode(newCode);
    // Optionally, update backend and broadcast
    dispatch(updateFileContent({ fileId: fileId!, content: newCode }));
    emitFileUpdate(newCode);
    // Remove the suggestion
    setAiSuggestions((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="h-screen flex bg-[var(--bg)] text-[var(--text)] font-mono">
      {/* Sidebar */}
      <div className="w-14 bg-[var(--bg-dark)] flex flex-col items-center py-4 space-y-6 border-r border-neonGreen">
        <FileText onClick={() => setShowFiles(!showFiles)} className="text-neonGreen w-5 h-5 hover:text-white cursor-pointer" />
        <MessageCircle onClick={() => setShowChat(!showChat)} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Play onClick={handleRun} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Users onClick={() => setShowCollaborators(!showCollaborators)} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Settings onClick={() => setShowSettings(!showSettings)} className="cursor-pointer text-neonGreen w-5 h-5 hover:text-white" />
        <Share2 className="text-neonGreen w-5 h-5 hover:text-white" />
      </div>

      {/* File Sidebar */}
      {showFiles && (
        <div className="w-64 bg-[var(--bg-dark)] border-r border-neonGreen flex flex-col p-2 text-white">
          <div className="flex justify-between items-center text-neonGreen font-bold mb-2">
            <span>Files</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowFiles(false)} />
          </div>
          <div className="flex flex-col gap-2 px-2">
            <div className="text-yellow-400">JS <span className="text-white">index.js</span></div>
          </div>
          <div className="mt-auto p-2 border-t border-neonGreen">
            📂 <span className="text-sm">Open File/Folder</span>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col m-4 border border-neonGreen rounded overflow-hidden">
        <div className="bg-[var(--bg)] text-neonGreen font-bold p-2 text-sm border-b border-neonGreen flex justify-between items-center">
          <span>Room: {projectId}/{fileId}</span>
          <button
            onClick={() => navigate("/home")}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
          >
            Leave
          </button>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="c"
            value={localCode}
            onChange={handleChange}
            onMount={editorDidMount}
            theme={darkTheme ? "vs-dark" : "light"}
            loading={loading ? "Loading file..." : undefined}
            options={{
              fontSize: 14,
              fontFamily: "monospace",
              minimap: { enabled: false },
              padding: { top: 12 },
            }}
          />
        </div>
      </div>

      {/* Chat */}
      {showChat && (
        <div className="w-80 bg-[var(--bg-dark)] border-l border-neonGreen flex flex-col">
          <div className="p-2 border-b border-neonGreen text-neonGreen font-bold flex items-center justify-between">
            <span>💬 Chat</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowChat(false)} />
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-sm bg-[var(--bg)] p-2 rounded text-white">{msg}</div>
            ))}
          </div>
          <div className="p-2 border-t border-neonGreen">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full px-2 py-1 bg-[var(--bg)] text-white border border-neonGreen rounded outline-none"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="w-80 bg-[var(--bg-dark)] border-l border-neonGreen p-4">
          <div className="flex items-center justify-between text-neonGreen font-bold border-b border-neonGreen mb-4">
            <span>⚙️ Settings</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowSettings(false)} />
          </div>
          <label className="flex items-center space-x-2 mb-2 text-white">
            <input type="checkbox" checked={darkTheme} onChange={(e) => setDarkTheme(e.target.checked)} />
            <span>Dark Theme</span>
          </label>
          <label className="flex items-center space-x-2 text-white">
            <input type="checkbox" checked={autosave} onChange={(e) => setAutosave(e.target.checked)} />
            <span>Autosave</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAIReview}
              className="bg-neonGreen text-black px-3 py-1 rounded hover:bg-green-400 transition"
              disabled={aiLoading}
            >
              {aiLoading ? "Reviewing..." : "AI Review"}
            </button>
            <button
              onClick={() => setShowAISidebar((prev) => !prev)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              {showAISidebar ? "Hide AI Suggestions" : "Show AI Suggestions"}
            </button>
          </div>
        </div>
      )}

      {/* Collaborators */}
      {showCollaborators && (
        <div className="w-80 bg-[var(--bg-dark)] border-l border-neonGreen p-4">
          <div className="flex items-center justify-between text-neonGreen font-bold border-b border-neonGreen mb-4">
            <span>👥 Collaborators</span>
            <X size={16} className="cursor-pointer hover:text-red-500" onClick={() => setShowCollaborators(false)} />
          </div>
          <div className="text-white space-y-2">
            {collaborators.map((user, index) => (
              <div key={index} className="bg-[var(--bg)] p-2 rounded text-sm">
                {user}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions Sidebar */}
      {showAISidebar && (
        <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-lg z-50 p-4 overflow-y-auto border-l border-neonGreen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">AI Suggestions</h2>
            <button onClick={() => setShowAISidebar(false)} className="text-neonGreen text-xl">&times;</button>
          </div>
          {aiSuggestions.length === 0 ? (
            <div className="text-gray-400">No suggestions yet.</div>
          ) : (
            <ul className="space-y-3">
              {aiSuggestions.map((sugg, idx) => (
                <li
                  key={idx}
                  className="bg-gray-800 rounded p-2 cursor-pointer hover:bg-gray-700 border-l-4 border-red-500"
                  onClick={() => jumpToLine(sugg.line)}
                >
                  <div className="font-semibold">Line {sugg.line}</div>
                  <div className="text-sm">{sugg.message}</div>
                  {sugg.severity && (
                    <div className="text-xs text-yellow-400 mt-1">{sugg.severity}</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {sugg.fix && (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        onClick={e => { e.stopPropagation(); handleApplySuggestion(sugg, idx); }}
                      >Apply</button>
                    )}
                    <button
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                      onClick={e => { e.stopPropagation(); handleIgnoreSuggestion(idx); }}
                    >Ignore</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <style>{`
  .ai-suggestion-underline {
    text-decoration: wavy underline red;
  }
  .ai-suggestion-glyph {
    background: url('data:image/svg+xml;utf8,<svg fill="red" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6"/></svg>') no-repeat center center;
    width: 16px;
    height: 16px;
    display: inline-block;
  }
`}</style>
    </div>
  );
};

export default EditorPage;
