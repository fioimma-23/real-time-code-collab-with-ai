use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::connection::firebase::FirebaseService;
use serde_json::json;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub owner: Uuid,
    pub members: Vec<Uuid>,
    pub files: Vec<Uuid>,
}

impl FirebaseService {
    pub async fn create_file(&self, name: String, owner: Uuid, project_id: Uuid) -> Result<Uuid, reqwest::Error> {
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
            "your-firebase-project-id",
            file_id
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

        let response = self
            .client
            .post(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send()
            .await?;

        if response.status().is_success() {
            println!("✅ File created");
        } else {
            eprintln!("❌ Create failed: {}", response.text().await.unwrap());
        }

        Ok(file_id)
    }

    pub async fn get_project(&self, project_id: &str) -> Result<serde_json::Value, reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/projects/{}",
            "your-firebase-project-id", project_id
        );

        let response = self.client.get(&url)
            .bearer_auth(&self.access_token)
            .send().await?;

        let body = response.json::<serde_json::Value>().await?;
        Ok(body)
    }

    pub async fn update_project_metadata(&self, project_id: &str, name: &str, description: &str) -> Result<(), reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/projects/{}?updateMask.fieldPaths=name&updateMask.fieldPaths=description",
            "your-firebase-project-id", project_id
        );

        let body = json!({
            "fields": {
                "name": { "stringValue": name },
                "description": { "stringValue": description }
            }
        });

        let response = self.client.patch(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send().await?;

        if response.status().is_success() {
            println!("✅ Project metadata updated");
        } else {
            eprintln!("❌ Update failed: {}", response.text().await.unwrap());
        }

        Ok(())
    }

    pub async fn update_project_members(&self, project_id: &str, members: &[Uuid]) -> Result<(), reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/projects/{}?updateMask.fieldPaths=members",
            "your-firebase-project-id", project_id
        );

        let body = json!({
            "fields": {
                "members": { "arrayValue": { "values": members.iter().map(|m| json!({ "stringValue": m.to_string() })).collect::<Vec<_>>() } }
            }
        });

        let response = self.client.patch(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send().await?;

        if response.status().is_success() {
            println!("✅ Members updated");
        } else {
            eprintln!("❌ Update failed: {}", response.text().await.unwrap());
        }

        Ok(())
    }

    pub async fn delete_project(&self, project_id: &str, file_ids: &[Uuid]) -> Result<(), reqwest::Error> {
        // First delete all files linked to the project
        for file_id in file_ids {
            self.delete_file(&file_id.to_string()).await?;
        }

        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/projects/{}",
            "your-firebase-project-id", project_id
        );

        let response = self.client.delete(&url)
            .bearer_auth(&self.access_token)
            .send().await?;

        if response.status().is_success() {
            println!("🗑️ Project deleted");
        } else {
            eprintln!("❌ Delete failed: {}", response.text().await.unwrap());
        }

        Ok(())
    }

    pub async fn list_all_projects(&self) -> Result<serde_json::Value, reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/projects",
            "your-firebase-project-id"
        );

        let response = self.client.get(&url)
            .bearer_auth(&self.access_token)
            .send().await?;

        let body = response.json::<serde_json::Value>().await?;
        Ok(body)
    }

    pub async fn add_file_to_project(&self, project_id: &str, file_id: Uuid) -> Result<(), reqwest::Error> {
        let mut project = self.get_project(project_id).await?;
        let files = project["fields"]["files"]["arrayValue"]["values"]
            .as_array_mut().unwrap_or(&mut vec![]);

        files.push(json!({ "stringValue": file_id.to_string() }));

        self.update_project_field(project_id, "files", files.clone()).await
    }

    pub async fn update_project_field(&self, project_id: &str, field: &str, values: Vec<serde_json::Value>) -> Result<(), reqwest::Error> {
        let url = format!(
            "https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents/projects/{}?updateMask.fieldPaths={}",
            "your-firebase-project-id", project_id, field
        );

        let body = json!({
            "fields": {
                field: { "arrayValue": { "values": values } }
            }
        });

        let response = self.client.patch(&url)
            .bearer_auth(&self.access_token)
            .json(&body)
            .send().await?;

        if response.status().is_success() {
            println!("✅ Project field '{}' updated", field);
        } else {
            eprintln!("❌ Update field failed: {}", response.text().await.unwrap());
        }

        Ok(())
    }
}