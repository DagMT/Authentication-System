-- Add 2FA fields to users table
ALTER TABLE users ADD COLUMN totp_secret VARCHAR(32) DEFAULT NULL;
ALTER TABLE users ADD COLUMN totp_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN totp_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create backup codes table
CREATE TABLE backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_backup_codes_user_id ON backup_codes(user_id);
CREATE INDEX idx_backup_codes_code ON backup_codes(code);
CREATE INDEX idx_users_totp_enabled ON users(totp_enabled);