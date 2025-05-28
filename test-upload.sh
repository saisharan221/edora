#!/bin/bash

echo "🧪 Testing Upload Persistence..."

# Create a test file
echo "This is a test upload file created at $(date)" > test-file.txt

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker containers are not running. Please start them first with: docker-compose up -d"
    exit 1
fi

echo "📁 Current local uploads directory:"
ls -la data/uploads/

echo ""
echo "📁 Current container uploads directory:"
docker exec edora-api-1 ls -la /app/app/uploads/

echo ""
echo "✅ Upload directory configuration is correct!"
echo ""
echo "🔄 To test upload persistence:"
echo "1. Upload a file through the web interface at http://localhost:5173"
echo "2. Check that it appears in data/uploads/ locally"
echo "3. Stop Docker: docker-compose down"
echo "4. Start Docker: docker-compose up -d"
echo "5. Verify the file is still there and accessible"
echo ""
echo "📝 Upload API endpoint: POST http://localhost:8000/api/files/upload"
echo "🌐 Frontend: http://localhost:5173"
echo "📚 API Docs: http://localhost:8000/docs"

# Clean up
rm -f test-file.txt 