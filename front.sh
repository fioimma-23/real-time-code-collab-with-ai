#!/bin/bash

# Exit immediately if any command fails
set -e

# Move to frontend directory
cd "$(dirname "$0")/frontend"

# Install dependencies
npm install

# Start the application
npm start
