-- Remove role_id from users table
ALTER TABLE users DROP COLUMN IF EXISTS role_id;

-- Drop tables in reverse order
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;