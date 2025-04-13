use serde::{Serialize, Deserialize};
use uuid::Uuid;

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
