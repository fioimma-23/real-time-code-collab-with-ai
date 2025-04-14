use crate::connection::auth::get_access_token;
// use anyhow::Result;
use reqwest::Client;

#[derive(Clone)]
pub struct FirebaseService {
    pub access_token: String,
    pub client: Client,
}

impl FirebaseService {
    pub async fn new() -> Self {
        let access_token = get_access_token().await.expect("Failed to get access token");
        let client = Client::new();
        println!("✅ Firestore REST client initialized");

        Self { access_token, client }
    }

/*     pub async fn test_connection(&self) {
        let project_id = "dcode-52a2c";
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents",
            project_id
        );

        match self.client
            .get(&url)
            .bearer_auth(&self.access_token)
            .send()
            .await
        {
            Ok(res) => {
                let status = res.status();
                let body = res.text().await.unwrap_or_else(|_| "Failed to read body".into());
                println!("✅ Firestore Status: {}", status);
                println!("✅ Firestore Body: {}", body);
            }
            Err(e) => {
                eprintln!("🔥 Firestore test connection error: {}", e);
            }
        }
    } */
}



/*  use anyhow::Result;
use reqwest::Client;

pub struct FirebaseService {
    pub client: Client,
    pub access_token: String,
}

impl FirebaseService {
    pub async fn new() -> Result<Self> {
        let client = Client::new();

        // Simulate fetching a Firebase token
        let access_token = "dummy_access_token".to_string();

        Ok(Self { client, access_token })
    }

    pub async fn test_connection(&self) {
        println!("✅ FirebaseService is connected. Access token: {}", self.access_token);
    }
} */
