use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::connection::firebase::FirebaseService;
use serde_json::json;


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserCred {
    pub id: Uuid,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserDetails {
    pub id: Uuid,
    pub display_name: String,
    pub username: String,
    pub email: String,
    pub projects: Vec<Uuid>,
}

impl FirebaseService {
    pub async fn create_user(
        &self,
        display_name: String,
        username: String,
        email: String,
        password: String,
    ) -> Result<Uuid, reqwest::Error> {
        let user_id = Uuid::new_v4();

        // 1. First, create the user_credentials document
        let creds_url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/user_credentials?documentId={}",
            "your-firebase-project-id",
            user_id
        );

        let creds_body = json!({
            "fields": {
                "id": { "stringValue": user_id.to_string() },
                "email": { "stringValue": email.clone() },  // Duplicate email for login lookup
                "password": { "stringValue": password }
            }
        });

        let creds_response = self
            .client
            .post(&creds_url)
            .bearer_auth(&self.access_token)
            .json(&creds_body)
            .send()
            .await?;

        if !creds_response.status().is_success() {
            eprintln!("❌ Failed to create user credentials: {}", creds_response.text().await.unwrap());
            return Err(reqwest::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                "Failed to create user credentials",
            )));
        }

        // 2. Then, create the user_details document
        let details_url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/user_details?documentId={}",
            "your-firebase-project-id",
            user_id
        );

        let details_body = json!({
            "fields": {
                "id": { "stringValue": user_id.to_string() },
                "display_name": { "stringValue": display_name },
                "username": { "stringValue": username },
                "email": { "stringValue": email },
                "projects": { "arrayValue": { "values": [] } }
            }
        });

        let details_response = self
            .client
            .post(&details_url)
            .bearer_auth(&self.access_token)
            .json(&details_body)
            .send()
            .await?;

        if details_response.status().is_success() {
            println!("✅ User created: {}", email);
        } else {
            // If user_details creation fails, attempt to clean up the credentials document
            eprintln!("❌ Failed to create user details: {}", details_response.text().await.unwrap());
            self.delete_user_credentials(&user_id.to_string()).await.ok();
            return Err(reqwest::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                "Failed to create user details",
            )));
        }

        Ok(user_id)
    }
    }

    pub async fn get_user_by_email(&self, email: &str) -> Result<Option<serde_json::Value>, reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents:runQuery",
            "your-firebase-project-id"
        );

        let query = json!({
            "structuredQuery": {
                "from": [{ "collectionId": "users" }],
                "where": {
                    "fieldFilter": {
                        "field": { "fieldPath": "email" },
                        "op": "EQUAL",
                        "value": { "stringValue": email }
                    }
                },
                "limit": 1
            }
        });

        let response = self.client.post(&url)
            .bearer_auth(&self.access_token)
            .json(&query)
            .send()
            .await?;

        let json: Vec<serde_json::Value> = response.json().await?;
        if let Some(document) = json.first().and_then(|d| d.get("document").cloned()) {
            Ok(Some(document))
        } else {
            Ok(None)
        }
    }

    pub async fn check_user_password(&self, email: &str, password: &str) -> Result<bool, reqwest::Error> {
        if let Some(user_doc) = self.get_user_by_email(email).await? {
            if let Some(stored) = user_doc["fields"]["password"]["stringValue"].as_str() {
                return Ok(stored == password);
            }
        }
        Ok(false)
    }

    pub async fn get_user_by_id(&self, id: &str) -> Result<Option<serde_json::Value>, reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents:runQuery",
            "your-firebase-project-id"
        );

        let query = json!({
            "structuredQuery": {
                "from": [{ "collectionId": "users" }],
                "where": {
                    "fieldFilter": {
                        "field": { "fieldPath": "id" },
                        "op": "EQUAL",
                        "value": { "stringValue": id }
                    }
                },
                "limit": 1
            }
        });

        let response = self.client.post(&url)
            .bearer_auth(&self.access_token)
            .json(&query)
            .send()
            .await?;

        let json: Vec<serde_json::Value> = response.json().await?;
        if let Some(document) = json.first().and_then(|d| d.get("document").cloned()) {
            Ok(Some(document))
        } else {
            Ok(None)
        }
    }

    pub async fn get_user_by_username(&self, username: &str) -> Result<Option<serde_json::Value>, reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents:runQuery",
            "your-firebase-project-id"
        );

        let query = json!({
            "structuredQuery": {
                "from": [{ "collectionId": "users" }],
                "where": {
                    "fieldFilter": {
                        "field": { "fieldPath": "username" },
                        "op": "EQUAL",
                        "value": { "stringValue": username }
                    }
                },
                "limit": 1
            }
        });

        let response = self.client.post(&url)
            .bearer_auth(&self.access_token)
            .json(&query)
            .send()
            .await?;

        let json: Vec<serde_json::Value> = response.json().await?;
        if let Some(document) = json.first().and_then(|d| d.get("document").cloned()) {
            Ok(Some(document))
        } else {
            Ok(None)
        }
    }
}

