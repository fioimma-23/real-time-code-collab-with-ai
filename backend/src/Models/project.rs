use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub owner: Uuid,
    pub members: Vec<Uuid>,
    pub files: Vec<Uuid>,
}