#!/bin/bash

# Exit immediately if any command fails
set -e

# Move to backend directory
cd "$(dirname "$0")/backend"

# Build the Rust application
cargo clean && cargo build
