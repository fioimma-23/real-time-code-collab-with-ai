use axum::{
    extract::{Path, Json},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;
use crate::Connections::firebase::FirebaseService;
use crate::model::user::{UserCred, UserDetails};

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub display_name: String,
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub message: String,
    pub user_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub authenticated: bool,
    pub user_details: Option<UserDetails>,
}

pub fn user_routes(firebase: Arc<FirebaseService>) -> Router {
    Router::new()
        .route("/users/create", post(move |payload| create_user_handler(firebase.clone(), payload)))
        .route("/users/id/:id", get(move |Path(id)| get_user_by_id_handler(firebase.clone(), id)))
        .route("/users/username/:username", get(move |Path(username)| get_user_by_username_handler(firebase.clone(), username)))
        .route("/users/login", post(move |payload| login_user_handler(firebase.clone(), payload)))
}

async fn create_user_handler(
    firebase: Arc<FirebaseService>,
    Json(payload): Json<CreateUserRequest>,
) -> impl IntoResponse {
    // Check if the user already exists by email
    if let Ok(Some(_)) = firebase.get_user_by_email(&payload.email).await {
        return (
            StatusCode::BAD_REQUEST,
            Json(UserResponse {
                message: "User with this email already exists".into(),
                user_id: None,
            }),
        ).into_response();
    }

    // If user does not exist, create the user
    match firebase.create_user(
        payload.display_name,
        payload.username,
        payload.email,
        payload.password
    ).await {
        Ok(user_id) => (
            StatusCode::CREATED,
            Json(UserResponse {
                message: "User created successfully".into(),
                user_id: Some(user_id),
            }),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(UserResponse {
                message: e.to_string(),
                user_id: None,
            }),
        ),
    }
}

async fn get_user_by_id_handler(firebase: Arc<FirebaseService>, id: String) -> impl IntoResponse {
    // We need to implement a get_user_by_id method in the FirebaseService
    match firebase.get_user_by_id(&id).await {
        Ok(Some(user)) => (StatusCode::OK, Json(user)).into_response(),
        Ok(None) => (StatusCode::NOT_FOUND, Json(json!({"error": "User not found"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": e.to_string()}))).into_response(),
    }
}

async fn get_user_by_username_handler(firebase: Arc<FirebaseService>, username: String) -> impl IntoResponse {
    // We need to implement a get_user_by_username method in the FirebaseService
    match firebase.get_user_by_username(&username).await {
        Ok(Some(user)) => (StatusCode::OK, Json(user)).into_response(),
        Ok(None) => (StatusCode::NOT_FOUND, Json(json!({"error": "User not found"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": e.to_string()}))).into_response(),
    }
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

async fn login_user_handler(
    firebase: Arc<FirebaseService>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    match firebase.check_user_password(&payload.email, &payload.password).await {
        Ok(true) => {
            // If authenticated, get the user details
            match firebase.get_user_by_username(&payload.email).await {
                Ok(Some(user_doc)) => {
                    // Parse the user document into UserDetails
                    let user_details = parse_user_details(&user_doc);
                    (StatusCode::OK, Json(LoginResponse {
                        authenticated: true,
                        user_details: Some(user_details),
                    })).into_response()
                },
                _ => (StatusCode::OK, Json(LoginResponse {
                    authenticated: true,
                    user_details: None,
                })).into_response(),
            }
        },
        Ok(false) => (StatusCode::UNAUTHORIZED, Json(LoginResponse {
            authenticated: false,
            user_details: None,
        })).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": e.to_string()}))).into_response(),
    }
}

// Helper function to parse user document into UserDetails struct
fn parse_user_details(user_doc: &serde_json::Value) -> UserDetails {
    let fields = &user_doc["fields"];
    
    let id_str = fields["id"]["stringValue"].as_str().unwrap_or_default();
    let id = Uuid::parse_str(id_str).unwrap_or_else(|_| Uuid::nil());
    
    let projects = fields["projects"]["arrayValue"]["values"]
        .as_array()
        .unwrap_or(&Vec::new())
        .iter()
        .filter_map(|v| {
            v["stringValue"].as_str().and_then(|id_str| {
                Uuid::parse_str(id_str).ok()
            })
        })
        .collect();

    UserDetails {
        id,
        display_name: fields["display_name"]["stringValue"].as_str().unwrap_or_default().to_string(),
        username: fields["username"]["stringValue"].as_str().unwrap_or_default().to_string(),
        email: fields["email"]["stringValue"].as_str().unwrap_or_default().to_string(),
        projects,
    }
}