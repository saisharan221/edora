#!/bin/bash

# eDora Docker Setup Script
echo "🚀 Setting up eDora Docker environment..."

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data/uploads
mkdir -p app/uploads

# Set proper permissions for uploads directory
echo "🔐 Setting permissions for uploads directory..."
chmod 755 data/uploads
chmod 755 app/uploads

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove any orphaned containers
echo "🧹 Cleaning up orphaned containers..."
docker-compose down --remove-orphans

# Build and start the containers
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

# Show container status
echo "📊 Container status:"
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f api      # Backend logs"
echo "   docker-compose logs -f frontend # Frontend logs"
echo ""
echo "🔄 To restart services:"
echo "   docker-compose restart"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down" 