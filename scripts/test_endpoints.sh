#!/bin/bash

BASE_URL="http://localhost:8080"
EMAIL="testuser@example.com"
PASSWORD="password123"

echo "🧪 Testing Authentication System Endpoints"
echo "=========================================="

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH=$(curl -s $BASE_URL/health)
echo "✅ Health: $HEALTH"
echo

# Test 2: User Registration
echo "2. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$REGISTER_RESPONSE" | grep -q "access_token"; then
    echo "✅ Registration successful"
    ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token')
    REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.refresh_token')
else
    echo "❌ Registration failed: $REGISTER_RESPONSE"
fi
echo

# Test 3: User Login
echo "3. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    echo "✅ Login successful"
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
else
    echo "❌ Login failed: $LOGIN_RESPONSE"
fi
echo

# Test 4: Protected Endpoint
echo "4. Testing Protected Profile Endpoint..."
PROFILE_RESPONSE=$(curl -s -X GET $BASE_URL/api/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "user"; then
    echo "✅ Profile access successful"
else
    echo "❌ Profile access failed: $PROFILE_RESPONSE"
fi
echo

# Test 5: Logout
echo "5. Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$LOGOUT_RESPONSE" | grep -q "successfully"; then
    echo "✅ Logout successful"
else
    echo "❌ Logout failed: $LOGOUT_RESPONSE"
fi
echo

# Test 6: Rate Limiting
echo "6. Testing Rate Limiting..."
echo "Making 12 rapid requests to trigger rate limit..."
RATE_LIMITED=false
for i in {1..12}; do
    RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"ratetest$i@example.com\",\"password\":\"$PASSWORD\"}")
    
    if echo "$RESPONSE" | grep -q "Rate limit exceeded"; then
        RATE_LIMITED=true
        break
    fi
done

if [ "$RATE_LIMITED" = true ]; then
    echo "✅ Rate limiting working correctly"
else
    echo "❌ Rate limiting not working"
fi
echo

# Test 7: Invalid Authentication
echo "7. Testing Invalid Authentication..."
INVALID_RESPONSE=$(curl -s -X GET $BASE_URL/api/profile \
  -H "Authorization: Bearer invalid_token")

if echo "$INVALID_RESPONSE" | grep -q "Invalid or expired token"; then
    echo "✅ Invalid token rejection working"
else
    echo "❌ Invalid token not properly rejected: $INVALID_RESPONSE"
fi
echo

echo "🎉 Endpoint testing completed!"