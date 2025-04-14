use anyhow::Result;
use reqwest::Client;
use serde_json::json;

pub struct RealtimeDatabaseService {
    pub client: Client,
    pub project_id: String,
    pub access_token: String,
}

impl RealtimeDatabaseService {
    pub async fn new(project_id: &str, access_token: &str) -> Self {
        let client = Client::new();
        Self {
            client,
            project_id: project_id.to_string(),
            access_token: access_token.to_string(),
        }
    }


}
