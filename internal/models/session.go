package models

import (
	"time"
	"github.com/google/uuid"
)

type Session struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	DeviceID  string    `json:"device_id"`
	UserAgent string    `json:"user_agent"`
	IPAddress string    `json:"ip_address"`
	Location  string    `json:"location,omitempty"`
	IsActive  bool      `json:"is_active"`
	LastSeen  time.Time `json:"last_seen"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

type ActiveSessionsResponse struct {
	Sessions []Session `json:"sessions"`
	Total    int       `json:"total"`
}

type RevokeSessionRequest struct {
	SessionID uuid.UUID `json:"session_id" binding:"required"`
}