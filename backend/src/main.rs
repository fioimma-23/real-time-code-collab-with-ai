use axum::{routing::get, Router};
use tokio::net::TcpListener;
use std::net::SocketAddr;
use std::sync::Arc;

// model
mod model;


// connection 
mod connection {
    pub mod auth;
    pub mod firebase;
}

// routers
mod routers {
    pub mod login;
}
use routers::login::auth_routes;

use connection::firebase::FirebaseService;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ✅ Initialize Firebase
    let firebase = Arc::new(FirebaseService::new().await);

    println!("Access token: {}", firebase.access_token);

    // ✅ Build Axum app
    // let app = Router::new().route("/", get({
    //     let firebase = Arc::clone(&firebase);
    //     move || handler(firebase)
    // }));

    let app = Router::new()
    .nest("/auth", auth_routes(Arc::clone(&firebase)))
    .route("/", get(|| async { "Hello, Axum with Firebase 🔥" }));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await?;
    println!("Listening on http://{}", addr);

    // ✅ Start Axum server
    axum::serve(listener, app).await?;

    Ok(())
}

// ✅ HTTP Handler
/* async fn handler(firebase: Arc<FirebaseService>) -> String {
    firebase.test_connection().await;
    "Hello, Axum v0.8 + Firebase connected!".to_string()
} */
