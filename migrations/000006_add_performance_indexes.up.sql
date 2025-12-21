-- Performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_created_at_desc ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until) WHERE locked_until IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_users_email_verified_active 
ON users(email, email_verified) WHERE email_verified = true;

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_unverified 
ON users(email_verify_token) WHERE email_verified = false AND email_verify_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_password_reset 
ON users(password_reset_token, password_reset_expiry) 
WHERE password_reset_token IS NOT NULL;

-- Add statistics for query planner
ANALYZE users;