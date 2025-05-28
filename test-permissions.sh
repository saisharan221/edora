#!/bin/bash

echo "🔐 Testing Edit/Delete Permissions..."

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker containers are not running. Please start them first with: docker-compose up -d"
    exit 1
fi

echo "✅ Containers are running!"
echo ""
echo "🔧 New API Endpoints Added:"
echo ""
echo "📝 Channel Management:"
echo "  PUT  /channels/{id}     - Edit channel (owner or admin only)"
echo "  DELETE /channels/{id}   - Delete channel (owner or admin only)"
echo ""
echo "📄 Post Management:"
echo "  PUT  /posts/{id}        - Edit post (author or admin only)"
echo "  DELETE /posts/{id}      - Delete post (author or admin only)"
echo ""
echo "🔒 Permission System:"
echo "  • Users can only edit/delete their own channels and posts"
echo "  • Admins can edit/delete any channel or post"
echo "  • API responses now include 'can_edit' and 'can_delete' flags"
echo ""
echo "👤 User Roles:"
echo "  • user      - Regular user (default)"
echo "  • moderator - Can moderate content"
echo "  • admin     - Full access to all content"
echo ""
echo "🧪 To test the functionality:"
echo "1. Create a user account at http://localhost:5173"
echo "2. Create a channel and post"
echo "3. Try to edit/delete your own content (should work)"
echo "4. Create an admin user with role 'admin'"
echo "5. Try to edit/delete other users' content as admin (should work)"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🌐 Frontend: http://localhost:5173"

echo ""
echo "🔍 Testing API availability..."
curl -s http://localhost:8000/docs > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ API is accessible"
else
    echo "❌ API is not accessible"
fi

curl -s http://localhost:5173 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi 