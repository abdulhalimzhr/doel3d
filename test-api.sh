#!/bin/bash

echo "🧪 Testing DOEL3D API Integration"
echo "=================================="

# Test 1: Check if backend is running
echo "1. Testing backend health..."
response=$(curl -s -w "%{http_code}" http://localhost:4000/graphql -X POST -H "Content-Type: application/json" -d '{"query":"query { listUploadedFiles }"}' -o /dev/null)
if [ "$response" == "200" ]; then
    echo "✅ Backend is running and responsive"
else
    echo "❌ Backend is not running (HTTP $response)"
    exit 1
fi

# Test 2: Test GraphQL query
echo "2. Testing GraphQL query..."
result=$(curl -s -X POST http://localhost:4000/graphql \
    -H "Content-Type: application/json" \
    -H "Origin: http://localhost:3000" \
    -d '{"query":"query { listUploadedFiles }"}')

if echo "$result" | grep -q "data"; then
    echo "✅ GraphQL query successful"
    echo "   Response: $result"
else
    echo "❌ GraphQL query failed"
    echo "   Response: $result"
    exit 1
fi

# Test 3: Check if frontend is running
echo "3. Testing frontend health..."
frontend_response=$(curl -s -w "%{http_code}" http://localhost:3000 -o /dev/null)
if [ "$frontend_response" == "200" ]; then
    echo "✅ Frontend is running and responsive"
else
    echo "❌ Frontend is not running (HTTP $frontend_response)"
    exit 1
fi

echo ""
echo "🎉 All tests passed! The application is ready for testing."
echo ""
echo "📱 Access the application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   GraphQL:  http://localhost:4000/graphql"
echo ""
echo "📋 To test file upload:"
echo "   1. Go to http://localhost:3000/estimate"
echo "   2. Upload an STL file"
echo "   3. Configure print settings"
echo "   4. Click 'Hitung Estimasi'"
