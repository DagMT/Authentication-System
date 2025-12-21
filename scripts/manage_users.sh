#!/bin/bash

echo "🔧 User Management Tool"
echo ""

case "$1" in
  "reset")
    EMAIL="$2"
    docker-compose -f docker-compose.backend.yml exec -T postgres psql -U authuser -d authdb << EOF
UPDATE users 
SET failed_login_attempts = 0, 
    locked_until = NULL 
WHERE email = '$EMAIL';
EOF
    echo "✅ Reset failed attempts for: $EMAIL"
    echo "   Try logging in again with your password"
    ;;
    
  "delete")
    EMAIL="$2"
    docker-compose -f docker-compose.backend.yml exec -T postgres psql -U authuser -d authdb << EOF
DELETE FROM users WHERE email = '$EMAIL';
EOF
    echo "✅ Deleted user: $EMAIL"
    echo "   You can now register again"
    ;;
    
  "list")
    docker-compose -f docker-compose.backend.yml exec -T postgres psql -U authuser -d authdb << EOF
SELECT email, email_verified, failed_login_attempts, 
       CASE WHEN locked_until IS NOT NULL THEN 'LOCKED' ELSE 'ACTIVE' END as status
FROM users;
EOF
    ;;
    
  *)
    echo "Usage:"
    echo "  bash manage_users.sh reset <email>   - Reset failed login attempts"
    echo "  bash manage_users.sh delete <email>  - Delete user (can re-register)"
    echo "  bash manage_users.sh list            - List all users"
    echo ""
    echo "Example:"
    echo "  bash manage_users.sh delete puspendrachawlax@gmail.com"
    echo "  Then register again at http://localhost:3000/register"
    ;;
esac
