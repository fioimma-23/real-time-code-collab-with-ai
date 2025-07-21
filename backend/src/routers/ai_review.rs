use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Deserialize)]
struct ReviewRequest {
    language: String,
    code: String,
}

#[derive(Serialize, Deserialize)]
pub struct Suggestion {
    line: usize,
    message: String,
    severity: Option<String>,
    fix: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ReviewResponse {
    suggestions: Vec<Suggestion>,
}

#[derive(Deserialize)]
pub struct CompileRequest {
    pub language: String,
    pub code: String,
}

#[derive(Serialize, Deserialize)]
pub struct CompileResponse {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
}

async fn review_code_handler(Json(req): Json<ReviewRequest>) -> Result<Json<ReviewResponse>, (axum::http::StatusCode, String)> {
    let ai_url = "http://localhost:8001/review";
    let client = reqwest::Client::new();
    let resp = client
        .post(ai_url)
        .json(&req)
        .send()
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let status = resp.status();
    let body = resp.text().await.unwrap_or_else(|_| "{\"suggestions\":[]}".to_string());
    if status.is_success() {
        let parsed: ReviewResponse = serde_json::from_str(&body).unwrap_or(ReviewResponse { suggestions: vec![] });
        Ok(Json(parsed))
    } else {
        Err((status, body))
    }
}

async fn compile_code_handler(Json(req): Json<CompileRequest>) -> Result<Json<CompileResponse>, (axum::http::StatusCode, String)> {
    let ai_url = "http://localhost:8001/compile";
    let client = reqwest::Client::new();
    let resp = client
        .post(ai_url)
        .json(&req)
        .send()
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let status = resp.status();
    let body = resp.text().await.unwrap_or_else(|_| "{\"stdout\":\"\",\"stderr\":\"\",\"exit_code\":1}".to_string());
    if status.is_success() {
        let parsed: CompileResponse = serde_json::from_str(&body).unwrap_or(CompileResponse { stdout: "".to_string(), stderr: "Error parsing response".to_string(), exit_code: 1 });
        Ok(Json(parsed))
    } else {
        Err((status, body))
    }
}

pub fn ai_review_routes() -> Router {
    Router::new()
        .route("/review", post(review_code_handler))
        .route("/compile", post(compile_code_handler))
} 