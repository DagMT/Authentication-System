-- Drop performance indexes
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_lower;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_created_at_desc;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_verified;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_locked_until;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email_verified_active;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_unverified;
DROP INDEX CONCURRENTLY IF EXISTS idx_users_password_reset;