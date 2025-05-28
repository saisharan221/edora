#!/bin/bash

echo "👑 Creating Admin User..."

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker containers are not running. Please start them first with: docker-compose up -d"
    exit 1
fi

# Default values
EMAIL="admin@edora.com"
PASSWORD="admin123"
API_URL="http://localhost:8000"

echo "📧 Email: $EMAIL"
echo "🔑 Password: $PASSWORD"
echo ""

# Create admin user
echo "🔄 Creating admin user..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"role\": \"admin\"
  }")

if echo "$RESPONSE" | grep -q "email"; then
    echo "✅ Admin user created successfully!"
    echo "📋 Response: $RESPONSE"
    echo ""
    echo "🔐 You can now login with:"
    echo "   Email: $EMAIL"
    echo "   Password: $PASSWORD"
    echo "   Role: admin"
    echo ""
    echo "🌐 Login at: http://localhost:5173"
elif echo "$RESPONSE" | grep -q "already registered"; then
    echo "ℹ️  Admin user already exists!"
    echo "🔐 Login credentials:"
    echo "   Email: $EMAIL"
    echo "   Password: $PASSWORD"
    echo "   Role: admin"
    echo ""
    echo "🌐 Login at: http://localhost:5173"
else
    echo "❌ Failed to create admin user"
    echo "📋 Response: $RESPONSE"
    exit 1
fi

echo ""
echo "🧪 As an admin, you can:"
echo "  • Edit and delete any channel"
echo "  • Edit and delete any post"
echo "  • Access all moderator functions"
echo ""
echo "💡 Regular users can only edit/delete their own content" 