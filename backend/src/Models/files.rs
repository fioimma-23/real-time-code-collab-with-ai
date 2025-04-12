use serde::{Serialize, Deserialize};
use uuid::Uuid;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct File {
    pub id: Uuid,
    pub name: String,
    pub path: PathBuf,
    pub size: u64,
    pub file_type: String,
    pub owner: Uuid,
    pub project_id: Uuid,
}