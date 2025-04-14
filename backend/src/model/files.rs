use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use uuid::Uuid;
use crate::connection::firebase::FirebaseService;
use reqwest::StatusCode;
use std::error::Error;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct File {
    pub id: Uuid,
    pub name: String,
    pub content: String,
    pub file_type: String,
    pub owner: Uuid,
    pub project_id: Uuid,
}

impl FirebaseService {
    pub async fn create_file(&self, name: String, owner: Uuid, project_id: Uuid) -> Result<Uuid, Box<dyn Error + Send + Sync>> {
        let file_id = Uuid::new_v4();
        let content = "".to_string();

        let file_type = match name.rsplit('.').next().unwrap_or("") {
            "c" => "C",
            "cpp" => "C++",
            "py" => "Python",
            "rs" => "Rust",
            "js" => "JavaScript",
            "ts" => "TypeScript",
            "html" => "HTML",
            "css" => "CSS",
            ext => ext,
        }.to_string();

        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/files?documentId={}",
            "your-firebase-project-id", file_id
        );

        let body = json!({
            "fields": {
                "id": { "stringValue": file_id.to_string() },
                "name": { "stringValue": name },
                "content": { "stringValue": content },
                "file_type": { "stringValue": file_type },
                "owner": { "stringValue": owner.to_string() },
                "project_id": { "stringValue": project_id.to_string() }
            }
        });

        let response = self.client.post(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send()
            .await?;

        if response.status().is_success() {
            Ok(file_id)
        } else {
            let error_text = response.text().await.unwrap_or_default();
            Err(error_text.into())
        }
    }

    pub async fn get_file_by_id(&self, file_id: &str) -> Result<Option<File>, Box<dyn Error + Send + Sync>> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/files/{}",
            "your-firebase-project-id", file_id
        );

        let response = self.client.get(&url)
            .bearer_auth(&self.access_token)
            .send()
            .await?;

        if response.status() == StatusCode::NOT_FOUND {
            return Ok(None);
        }

        let json = response.json::<Value>().await?;
        let fields = &json["fields"];

        let file = File {
            id: Uuid::parse_str(fields["id"]["stringValue"].as_str().unwrap_or(""))
                .map_err(|e| Box::new(e) as Box<dyn Error + Send + Sync>)?,
            name: fields["name"]["stringValue"].as_str().unwrap_or("").to_string(),
            content: fields["content"]["stringValue"].as_str().unwrap_or("").to_string(),
            file_type: fields["file_type"]["stringValue"].as_str().unwrap_or("").to_string(),
            owner: Uuid::parse_str(fields["owner"]["stringValue"].as_str().unwrap_or(""))
                .map_err(|e| Box::new(e) as Box<dyn Error + Send + Sync>)?,
            project_id: Uuid::parse_str(fields["project_id"]["stringValue"].as_str().unwrap_or(""))
                .map_err(|e| Box::new(e) as Box<dyn Error + Send + Sync>)?,
        };

        Ok(Some(file))
    }

    pub async fn get_file_by_name(&self, name: &str) -> Result<Option<File>, Box<dyn Error + Send + Sync>> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents:runQuery",
            "your-firebase-project-id"
        );

        let body = json!({
            "structuredQuery": {
                "from": [{ "collectionId": "files" }],
                "where": {
                    "fieldFilter": {
                        "field": { "fieldPath": "name" },
                        "op": "EQUAL",
                        "value": { "stringValue": name }
                    }
                },
                "limit": 1
            }
        });

        let response = self.client.post(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send()
            .await?;

        let results = response.json::<Vec<Value>>().await?;

        if let Some(doc) = results.first().and_then(|r| r.get("document")) {
            let fields = &doc["fields"];
            let file = File {
                id: Uuid::parse_str(fields["id"]["stringValue"].as_str().unwrap_or(""))
                    .map_err(|e| Box::new(e) as Box<dyn Error + Send + Sync>)?,
                name: fields["name"]["stringValue"].as_str().unwrap_or("").to_string(),
                content: fields["content"]["stringValue"].as_str().unwrap_or("").to_string(),
                file_type: fields["file_type"]["stringValue"].as_str().unwrap_or("").to_string(),
                owner: Uuid::parse_str(fields["owner"]["stringValue"].as_str().unwrap_or(""))
                    .map_err(|e| Box::new(e) as Box<dyn Error + Send + Sync>)?,
                project_id: Uuid::parse_str(fields["project_id"]["stringValue"].as_str().unwrap_or(""))
                    .map_err(|e| Box::new(e) as Box<dyn Error + Send + Sync>)?,
            };
            Ok(Some(file))
        } else {
            Ok(None)
        }
    }

    pub async fn update_file_content(&self, file_id: &str, new_content: &str) -> Result<(), Box<dyn Error + Send + Sync>> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/files/{}?updateMask.fieldPaths=content",
            "your-firebase-project-id", file_id
        );

        let body = json!({
            "fields": {
                "content": { "stringValue": new_content }
            }
        });

        let response = self.client.patch(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send()
            .await?;

        if response.status().is_success() {
            Ok(())
        } else {
            let error = response.text().await.unwrap_or_default();
            Err(error.into())
        }
    }

    pub async fn delete_file(&self, file_id: &str) -> Result<bool, Box<dyn Error + Send + Sync>> {
        if self.get_file_by_id(file_id).await?.is_none() {
            return Ok(false);
        }

        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/files/{}",
            "your-firebase-project-id", file_id
        );

        let response = self.client.delete(&url)
            .bearer_auth(&self.access_token)
            .send()
            .await?;

        match response.status() {
            StatusCode::NO_CONTENT | StatusCode::OK => Ok(true),
            _ => {
                let error = response.text().await.unwrap_or_default();
                Err(error.into())
            }
        }
    }
}
