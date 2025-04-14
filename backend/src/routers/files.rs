use axum::{
    extract::{Path, Json},
    http::StatusCode,
    response::IntoResponse,
    routing::{delete, get, post, put},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;
use crate::connection::firebase::FirebaseService;
use crate::model::files::File;

#[derive(Debug, Deserialize)]
pub struct CreateFileRequest {
    pub name: String,
    pub owner: Uuid,
    pub project_id: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct UpdateContentRequest {
    pub new_content: String,
}

#[derive(Debug, Serialize)]
pub struct FileResponse {
    pub message: String,
    pub file_id: Option<Uuid>,
}

pub fn file_routes(firebase: Arc<FirebaseService>) -> Router {
    Router::new()
        .route("/files/create", post(move |payload| create_file_handler(firebase.clone(), payload)))
        .route("/files/id/:id", get(move |Path(id)| get_file_by_id_handler(firebase.clone(), id)))
        .route("/files/name/:name", get(move |Path(name)| get_file_by_name_handler(firebase.clone(), name)))
        .route("/files/id/:id", delete(move |Path(id)| delete_file_handler(firebase.clone(), id)))
        .route("/files/id/:id", put(move |Path(id), payload| update_file_content_handler(firebase.clone(), id, payload)))
}

async fn create_file_handler(
    firebase: Arc<FirebaseService>,
    Json(payload): Json<CreateFileRequest>,
) -> impl IntoResponse {
    // Check if the file already exists by name
    if let Ok(Some(_)) = firebase.get_file_by_name(&payload.name).await {
        return (
            StatusCode::BAD_REQUEST,
            Json(FileResponse {
                message: "File with this name already exists".into(),
                file_id: None,
            }),
        ).into_response();
    }

    // If file does not exist, create the file
    match firebase.create_file(payload.name, payload.owner, payload.project_id).await {
        Ok(file_id) => (
            StatusCode::CREATED,
            Json(FileResponse {
                message: "File created successfully".into(),
                file_id: Some(file_id),
            }),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(FileResponse {
                message: e.to_string(),
                file_id: None,
            }),
        ),
    }
}


async fn get_file_by_id_handler(firebase: Arc<FirebaseService>, id: String) -> impl IntoResponse {
    match firebase.get_file_by_id(&id).await {
        Ok(Some(file)) => (StatusCode::OK, Json(file)).into_response(),
        Ok(None) => (StatusCode::NOT_FOUND, Json(json!({"error": "File not found"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": e.to_string()}))).into_response(),
    }
}

async fn get_file_by_name_handler(firebase: Arc<FirebaseService>, name: String) -> impl IntoResponse {
    match firebase.get_file_by_name(&name).await {
        Ok(Some(file)) => (StatusCode::OK, Json(file)).into_response(),
        Ok(None) => (StatusCode::NOT_FOUND, Json(json!({"error": "File not found"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": e.to_string()}))).into_response(),
    }
}

async fn update_file_content_handler(
    firebase: Arc<FirebaseService>,
    id: String,
    Json(payload): Json<UpdateContentRequest>,
) -> impl IntoResponse {
    match firebase.update_file_content(&id, &payload.new_content).await {
        Ok(_) => (StatusCode::OK, Json(json!({"message": "File updated"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": e.to_string()}))).into_response(),
    }
}

async fn delete_file_handler(
    firebase: Arc<FirebaseService>,
     id: String
) -> impl IntoResponse {
    match firebase.get_file_by_id(&id).await {
        Ok(None) => {
            return (
                StatusCode::NOT_FOUND,
                Json(json!({"error": "File not found"})),
            )
            .into_response();
        }
        Ok(Some(_)) => {
            // Proceed to delete the file if it exists
            match firebase.delete_file(&id).await {
                Ok(true) => {
                    return (
                        StatusCode::OK,
                        Json(json!({"message": "File deleted"})),
                    )
                    .into_response();
                }
                Ok(false) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!({"error": "Error while deleting file"})),
                    )
                    .into_response();
                }
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!({"error": e.to_string()})),
                    )
                    .into_response();
                }
            }
        }
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error": e.to_string()})),
            )
            .into_response();
        }
    }
}
