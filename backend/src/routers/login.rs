use axum::{
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;

use crate::connection::firebase::FirebaseService;
use crate::model::user::{UserCred, UserDetails};

pub fn auth_routes(firebase: Arc<FirebaseService>) -> Router {
    Router::new()
        .route(
            "/login",
            get({
                let firebase = Arc::clone(&firebase);
                move |payload| login_handler(firebase, payload)
            }),
        )
        .route(
            "/register",
            post({
                let firebase = Arc::clone(&firebase);
                move |payload| register_handler(firebase, payload)
            }),
        )
}

#[derive(Debug, Deserialize)]
pub struct AuthPayload {
    pub email: String,
    pub password: String,
    pub display_name: String,
    pub username: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    message: String,
}

// ✅ Register handler: store user in Firestore
async fn register_handler(
    firebase: Arc<FirebaseService>,
    Json(payload): Json<AuthPayload>,
) -> Json<AuthResponse> {
    println!("🚀 Registering user: {:?}", payload);

    let user_id = Uuid::new_v4();

    let user_details = UserDetails {
        id: user_id,
        display_name: payload.display_name,
        username: payload.username,
        email: payload.email.clone(),
        projects: vec![],
    };

    let user_cred = UserCred {
        id: user_id,
        password: payload.password,
    };

    // Build Firestore URL
    let project_id = "dcode-7b1a0";
    let database_id = "(default)";
    let collection_name = "users";
    let url = format!(
        "https://firestore.googleapis.com/v1/projects/{}/databases/{}/documents/{}?documentId={}",
        project_id, database_id, collection_name, user_id
    );

    // Serialize to Firestore format
    let body = serde_json::json!({
        "fields": {
            "id": { "stringValue": user_id.to_string() },
            "display_name": { "stringValue": user_details.display_name },
            "username": { "stringValue": user_details.username },
            "email": { "stringValue": user_details.email },
            "projects": {
                "arrayValue": {
                    "values": []
                }
            },
            "password": { "stringValue": user_cred.password }
        }
    });

    let response = firebase
        .client
        .post(&url)
        .bearer_auth(&firebase.access_token)
        .json(&body)
        .send()
        .await
        .expect("Failed to send Firestore request");

    let status = response.status();
    let response_body = response.text().await.unwrap_or_default();

    println!("✅ Firestore Status: {}", status);
    println!("✅ Firestore Body: {}", response_body);

    Json(AuthResponse {
        message: format!("User registered: {}", payload.email),
    })
}

async fn login_handler(
    firebase: Arc<FirebaseService>,
    Json(payload): Json<AuthPayload>,
) -> Json<AuthResponse> {
    println!("🚀 Login attempt: {:?}", payload);

    let project_id = "dcode-7b1a0";
    let database_id = "(default)";
    let collection_name = "users";
    let url = format!(
        "https://firestore.googleapis.com/v1/projects/{}/databases/{}/documents:runQuery",
        project_id, database_id
    );

    let body = serde_json::json!({
        "structuredQuery": {
            "from": [{ "collectionId": collection_name }],
            "where": {
                "fieldFilter": {
                    "field": { "fieldPath": "email" },
                    "op": "EQUAL",
                    "value": { "stringValue": payload.email }
                }
            },
            "limit": 1
        }
    });

    let response = firebase
        .client
        .post(&url)
        .bearer_auth(&firebase.access_token)
        .json(&body)
        .send()
        .await
        .expect("Failed to send Firestore request");

    let status = response.status();
    let response_body = response.text().await.unwrap_or_default();

    println!("✅ Firestore Status: {}", status);
    println!("✅ Firestore Body: {}", response_body);

    // Parse response
    let json_response: Vec<serde_json::Value> =
        serde_json::from_str(&response_body).unwrap_or_default();

    // Check if user exists
    if let Some(document) = json_response.get(0).and_then(|doc| doc.get("document")) {
        let fields = document.get("fields").unwrap();
        let stored_password = fields
            .get("password")
            .and_then(|val| val.get("stringValue"))
            .and_then(|val| val.as_str())
            .unwrap_or("");

        if stored_password == payload.password {
            Json(AuthResponse {
                message: format!("✅ Login successful: {}", payload.email),
            })
        } else {
            Json(AuthResponse {
                message: "❌ Incorrect password.".to_string(),
            })
        }
    } else {
        Json(AuthResponse {
            message: "❌ User not found.".to_string(),
        })
    }
}
