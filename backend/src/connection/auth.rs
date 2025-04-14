use yup_oauth2::{read_service_account_key, ServiceAccountAuthenticator};

pub async fn get_access_token() -> Result<String, Box<dyn std::error::Error>> {
    // ✅ Path to your service account JSON file
    let service_account_key = read_service_account_key("src/connection/serviceAccountKey.json").await?;

    // ✅ Build the authenticator
    let auth = ServiceAccountAuthenticator::builder(service_account_key)
        .build()
        .await?;

    // ✅ Specify required scopes for Firestore
    let scopes = &["https://www.googleapis.com/auth/datastore"];

    // ✅ Request token
    let token = auth.token(scopes).await?;

    println!("✅ Access token generated automatically.");
    Ok(token.token().unwrap_or_default().to_string()) // ✅ FIXED
}
