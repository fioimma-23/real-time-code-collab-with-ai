use crate::connection::auth::get_access_token; // ✅ FIXED CAPITALIZATION
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use reqwest::Client;

pub struct FirebaseService {
    pub client: Client,
    pub access_token: String,
}

impl FirebaseService {
    pub async fn new() -> Self {
        let access_token = get_access_token()
            .await
            .expect("Failed to get access token");
        let client = Client::new();

        println!("✅ Firestore REST client initialized");
        Self {
            client,
            access_token,
        }
    }

    pub async fn test_connection(&self) {
        let project_id = "dcode-7b1a0";
        let database_id = "(default)";
        let collection_name = "my_collection";

        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/{}/documents/{}",
            project_id, database_id, collection_name
        );

        let response = self
            .client
            .get(&url)
            .header(AUTHORIZATION, format!("Bearer {}", self.access_token))
            .header(CONTENT_TYPE, "application/json")
            .send()
            .await
            .expect("Failed to send request");

        let status = response.status();
        let body = response.text().await.expect("Failed to read response");

        println!("✅ Firestore Status: {}", status);
        println!("✅ Firestore Body: {}", body);
    }
}
