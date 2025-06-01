#!/bin/bash

# Create necessary directories
mkdir -p data
mkdir -p uploads

# Make sure the data directory is writable
chmod 755 data uploads

echo "Setup complete! Directories created:"
echo "- data/ (for SQLite database)"
echo "- uploads/ (for file uploads)"
echo ""
echo "You can now run: docker-compose up --build" 