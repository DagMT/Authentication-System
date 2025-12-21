package models

import (
	"time"
	"github.com/google/uuid"
)

type TOTPSetupRequest struct {
	UserID uuid.UUID `json:"user_id"`
}

type TOTPSetupResponse struct {
	Secret    string   `json:"secret"`
	QRCode    string   `json:"qr_code"`
	BackupCodes []string `json:"backup_codes"`
}

type TOTPVerifyRequest struct {
	Code string `json:"code" binding:"required,len=6"`
}

type TOTPDisableRequest struct {
	Password string `json:"password" binding:"required"`
}

type BackupCode struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Code      string    `json:"code"`
	Used      bool      `json:"used"`
	UsedAt    *time.Time `json:"used_at,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}