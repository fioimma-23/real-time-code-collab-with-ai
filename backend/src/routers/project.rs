// src/routers/project_router.rs
use axum::{
  extract::Path,
  routing::{delete, get, post, put},
  Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;

use crate::connection::firebase::FirebaseService;
use crate::model::project::Project;

pub fn project_routes(firebase: Arc<FirebaseService>) -> Router {
    Router::new()
        .route(
            "/",
            post({
                let firebase = Arc::clone(&firebase);
                move |payload| create_project_handler(firebase, payload)
            }),
        )
        .route(
            "/{project_id}",  // Changed from :project_id
            get({
                let firebase = Arc::clone(&firebase);
                move |path| get_project_handler(firebase, path)
            }),
        )
        .route(
            "/{project_id}",  // Changed from :project_id
            put({
                let firebase = Arc::clone(&firebase);
                move |path, payload| update_project_handler(firebase, path, payload)
            }),
        )
        .route(
            "/{project_id}",  // Changed from :project_id
            delete({
                let firebase = Arc::clone(&firebase);
                move |path| delete_project_handler(firebase, path)
            }),
        )
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
  pub name: String,
  pub description: String,
  pub owner: Uuid,
}

#[derive(Debug, Serialize)]
pub struct ProjectResponse {
  success: bool,
  message: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  project: Option<Project>,
}

// Create Project Handler
async fn create_project_handler(
  firebase: Arc<FirebaseService>,
  Json(payload): Json<CreateProjectRequest>,
) -> Json<ProjectResponse> {
  let project_id = Uuid::new_v4();
  let project = Project {
      id: project_id,
      name: payload.name,
      description: payload.description,
      owner: payload.owner,
      members: vec![payload.owner], // Include owner as initial member
      files: vec![],
  };

  let project_id_str = project_id.to_string();
  let url = format!(
      "https://firestore.googleapis.com/v1/projects/dcode-7b1a0/databases/(default)/documents/projects?documentId={}",
      project_id_str
  );

  let body = serde_json::json!({
      "fields": {
          "id": { "stringValue": project_id_str },
          "name": { "stringValue": project.name },
          "description": { "stringValue": project.description },
          "owner": { "stringValue": project.owner.to_string() },
          "members": {
              "arrayValue": {
                  "values": project.members.iter().map(|m| {
                      serde_json::json!({ "stringValue": m.to_string() })
                  }).collect::<Vec<_>>()
              }
          },
          "files": {
              "arrayValue": {
                  "values": project.files.iter().map(|f| {
                      serde_json::json!({ "stringValue": f.to_string() })
                  }).collect::<Vec<_>>()
              }
          }
      }
  });

  let response = firebase
      .client
      .post(&url)
      .bearer_auth(&firebase.access_token)
      .json(&body)
      .send()
      .await
      .expect("Failed to create project");

  let status = response.status();
  let response_body = response.text().await.unwrap_or_default();

  Json(ProjectResponse {
      success: status.is_success(),
      message: if status.is_success() {
          "Project created successfully".to_string()
      } else {
          format!("Failed to create project: {}", response_body)
      },
      project: Some(project),
  })
}

// Get Project Handler
async fn get_project_handler(
  firebase: Arc<FirebaseService>,
  Path(project_id): Path<Uuid>,
) -> Json<ProjectResponse> {
  let url = format!(
      "https://firestore.googleapis.com/v1/projects/dcode-7b1a0/databases/(default)/documents/projects/{}",
      project_id
  );

  let response = firebase
      .client
      .get(&url)
      .bearer_auth(&firebase.access_token)
      .send()
      .await
      .expect("Failed to fetch project");

  let status = response.status();
  let response_body = response.text().await.unwrap_or_default();

  if status.is_success() {
      let document: serde_json::Value = serde_json::from_str(&response_body).unwrap();
      let fields = document["fields"].as_object().unwrap();

      let project = Project {
          id: project_id,
          name: fields["name"]["stringValue"].as_str().unwrap().to_string(),
          description: fields["description"]["stringValue"].as_str().unwrap().to_string(),
          owner: Uuid::parse_str(fields["owner"]["stringValue"].as_str().unwrap()).unwrap(),
          members: fields["members"]["arrayValue"]["values"]
              .as_array()
              .unwrap()
              .iter()
              .filter_map(|v| Uuid::parse_str(v["stringValue"].as_str().unwrap()).ok())
              .collect(),
          files: fields["files"]["arrayValue"]["values"]
              .as_array()
              .unwrap()
              .iter()
              .filter_map(|v| Uuid::parse_str(v["stringValue"].as_str().unwrap()).ok())
              .collect(),
      };

      Json(ProjectResponse {
          success: true,
          message: "Project retrieved successfully".to_string(),
          project: Some(project),
      })
  } else {
      Json(ProjectResponse {
          success: false,
          message: format!("Failed to fetch project: {}", response_body),
          project: None,
      })
  }
}

// Update Project Handler
async fn update_project_handler(
  firebase: Arc<FirebaseService>,
  Path(project_id): Path<Uuid>,
  Json(payload): Json<CreateProjectRequest>,
) -> Json<ProjectResponse> {
  let url = format!(
      "https://firestore.googleapis.com/v1/projects/dcode-7b1a0/databases/(default)/documents/projects/{}",
      project_id
  );

  let body = serde_json::json!({
      "fields": {
          "name": { "stringValue": payload.name },
          "description": { "stringValue": payload.description },
          "owner": { "stringValue": payload.owner.to_string() }
      }
  });

  let response = firebase
      .client
      .patch(&url)
      .bearer_auth(&firebase.access_token)
      .json(&body)
      .send()
      .await
      .expect("Failed to update project");

  let status = response.status();
  let response_body = response.text().await.unwrap_or_default();

  Json(ProjectResponse {
      success: status.is_success(),
      message: if status.is_success() {
          "Project updated successfully".to_string()
      } else {
          format!("Failed to update project: {}", response_body)
      },
      project: None,
  })
}

// Delete Project Handler
async fn delete_project_handler(
  firebase: Arc<FirebaseService>,
  Path(project_id): Path<Uuid>,
) -> Json<ProjectResponse> {
  let url = format!(
      "https://firestore.googleapis.com/v1/projects/dcode-7b1a0/databases/(default)/documents/projects/{}",
      project_id
  );

  let response = firebase
      .client
      .delete(&url)
      .bearer_auth(&firebase.access_token)
      .send()
      .await
      .expect("Failed to delete project");

  let status = response.status();
  let response_body = response.text().await.unwrap_or_default();

  Json(ProjectResponse {
      success: status.is_success(),
      message: if status.is_success() {
          "Project deleted successfully".to_string()
      } else {
          format!("Failed to delete project: {}", response_body)
      },
      project: None,
  })
}