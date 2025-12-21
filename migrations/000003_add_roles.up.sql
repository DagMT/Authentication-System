-- Create roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Add role_id to users table
ALTER TABLE users ADD COLUMN role_id UUID REFERENCES roles(id) DEFAULT NULL;

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
    ('admin', 'Full system access'),
    ('user', 'Standard user access'),
    ('moderator', 'Content moderation access');

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES 
    ('users.read', 'users', 'read', 'View user information'),
    ('users.write', 'users', 'write', 'Create and update users'),
    ('users.delete', 'users', 'delete', 'Delete users'),
    ('admin.access', 'admin', 'access', 'Access admin panel'),
    ('content.moderate', 'content', 'moderate', 'Moderate user content');

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin'; -- Admin gets all permissions

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'user' AND p.name IN ('users.read');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'moderator' AND p.name IN ('users.read', 'content.moderate');

-- Create indexes
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);