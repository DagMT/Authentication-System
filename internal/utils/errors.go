package utils

import (
	"net/http"
	"runtime"
)

type AppError struct {
	Code       string                 `json:"code"`
	Message    string                 `json:"message"`
	Details    map[string]interface{} `json:"details,omitempty"`
	StatusCode int                    `json:"-"`
	Stack      string                 `json:"-"`
}

func (e *AppError) Error() string {
	return e.Message
}

func NewAppError(code, message string, statusCode int) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
		Stack:      getStack(),
	}
}

func NewValidationError(field, message string) *AppError {
	return &AppError{
		Code:       "VALIDATION_ERROR",
		Message:    "Validation failed",
		StatusCode: http.StatusBadRequest,
		Details: map[string]interface{}{
			"field": field,
			"error": message,
		},
		Stack: getStack(),
	}
}

func NewAuthError(code, message string) *AppError {
	statusCode := http.StatusUnauthorized
	if code == "ACCOUNT_LOCKED" {
		statusCode = http.StatusLocked
	} else if code == "EMAIL_NOT_VERIFIED" {
		statusCode = http.StatusForbidden
	}
	
	return &AppError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
		Stack:      getStack(),
	}
}

func getStack() string {
	buf := make([]byte, 1024)
	for {
		n := runtime.Stack(buf, false)
		if n < len(buf) {
			return string(buf[:n])
		}
		buf = make([]byte, 2*len(buf))
	}
}

// Common error codes
const (
	ErrCodeInvalidCredentials = "INVALID_CREDENTIALS"
	ErrCodeAccountLocked      = "ACCOUNT_LOCKED"
	ErrCodeEmailNotVerified   = "EMAIL_NOT_VERIFIED"
	ErrCodeTokenExpired       = "TOKEN_EXPIRED"
	ErrCodeTokenInvalid       = "TOKEN_INVALID"
	ErrCodeUserExists         = "USER_EXISTS"
	ErrCodeUserNotFound       = "USER_NOT_FOUND"
	ErrCodeValidationFailed   = "VALIDATION_FAILED"
	ErrCodeRateLimitExceeded  = "RATE_LIMIT_EXCEEDED"
	ErrCodeInsufficientPerms  = "INSUFFICIENT_PERMISSIONS"
)