use axum::Router;
use std::{net::SocketAddr, sync::Arc};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
// use http::header::{AUTHORIZATION, CONTENT_TYPE, ACCEPT};
use http::{Method, header::{AUTHORIZATION, CONTENT_TYPE, ACCEPT}};


// modules
mod model;
mod connection {
    pub mod auth;
    pub mod firebase;
    pub mod real_time; 
}
mod routers {
    pub mod login;
    pub mod project;
}



use connection::firebase::FirebaseService;
use crate::connection::real_time::RealtimeDatabaseService;

use routers::login::auth_routes;
use routers::project::project_routes;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ✅ Initialize Firebase
    let firebase = Arc::new(FirebaseService::new().await);

    println!("Access token: {}", firebase.access_token);

    let realtime_db = RealtimeDatabaseService::new("dcode-7b1a0", &firebase.access_token).await;
    println!("Realtime Database Service initialized with project ID: {}", realtime_db.project_id);
    println!("Access token: {}", realtime_db.access_token);
    // ✅ CORS setup
    let cors = CorsLayer::new()
    .allow_origin([
        "http://localhost:3000".parse().unwrap(),
        "http://localhost:5173".parse().unwrap(),
        "http://127.0.0.1:3000".parse().unwrap(),
        "http://localhost:8080".parse().unwrap(),
    ])
    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
    .allow_headers([AUTHORIZATION, CONTENT_TYPE, ACCEPT])
    .allow_credentials(true);

    // ✅ Build Axum app
    let app = Router::new()
        .nest("/auth", auth_routes(Arc::clone(&firebase)))
        .nest("/project", project_routes(Arc::clone(&firebase)))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5000));
    let listener = TcpListener::bind(addr).await?;
    println!("🚀 Listening on http://{}", addr);

    axum::serve(listener, app).await?;

    Ok(())
}
