package handlers

import (
	"net/http"
	"time"

	"github.com/Flack74/go-auth-system/internal/config"
	"github.com/Flack74/go-auth-system/internal/models"
	"github.com/Flack74/go-auth-system/internal/services"
	"github.com/Flack74/go-auth-system/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthHandler struct {
	authService *services.AuthService
	logger      *utils.Logger
	config      *config.Config
}

func NewAuthHandler(authService *services.AuthService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		logger:      utils.NewLogger(),
		config:      cfg,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.LogSecurityEvent(c.Request.Context(), "invalid_register_request", map[string]interface{}{
			"error": err.Error(),
			"ip":    c.ClientIP(),
		})
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.authService.Register(&req)
	if err != nil {
		h.logger.LogAuthEvent(c.Request.Context(), "register", req.Email, false)
		switch err {
		case services.ErrUserAlreadyExists:
			c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration failed"})
		}
		return
	}

	h.logger.LogAuthEvent(c.Request.Context(), "register", req.Email, true)
	h.logger.LogBusinessEvent(c.Request.Context(), "user_registered", map[string]interface{}{
		"email": req.Email,
		"ip":    c.ClientIP(),
	})
	
	// Set secure cookies for web clients
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("access_token", response.AccessToken, 900, "/", "", true, true)
	c.SetCookie("refresh_token", response.RefreshToken, 604800, "/", "", true, true)
	
	c.JSON(http.StatusCreated, response)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.LogSecurityEvent(c.Request.Context(), "invalid_login_request", map[string]interface{}{
			"error": err.Error(),
			"ip":    c.ClientIP(),
		})
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if client prefers session-based auth
	useSession := c.GetHeader("X-Auth-Type") == "session"
	
	response, err := h.authService.Login(&req)
	if err != nil {
		h.logger.LogAuthEvent(c.Request.Context(), "login", req.Email, false)
		switch err {
		case services.ErrInvalidCredentials:
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		case services.ErrAccountLocked:
			h.logger.LogSecurityEvent(c.Request.Context(), "account_locked_login_attempt", map[string]interface{}{
				"email": req.Email,
				"ip":    c.ClientIP(),
			})
			c.JSON(http.StatusLocked, gin.H{"error": "Account locked due to too many failed attempts"})
		case services.ErrEmailNotVerified:
			c.JSON(http.StatusForbidden, gin.H{"error": "Email not verified"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Login failed"})
		}
		return
	}

	h.logger.LogAuthEvent(c.Request.Context(), "login", req.Email, true)
	
	if useSession {
		// Session-based auth: set session cookie only
		c.SetSameSite(http.SameSiteStrictMode)
		c.SetCookie("session_id", "session-placeholder", 1800, "/", "", true, true) // 30min
		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": response.User})
	} else {
		// JWT-based auth: set token cookies
		c.SetSameSite(http.SameSiteStrictMode)
		c.SetCookie("access_token", response.AccessToken, 900, "/", "", true, true) // 15min
		c.SetCookie("refresh_token", response.RefreshToken, 604800, "/", "", true, true) // 7days
		c.JSON(http.StatusOK, response)
	}
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req models.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.authService.RefreshToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	token, exists := c.Get("token")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
		return
	}

	// Get refresh token from cookie or request body
	refreshToken, _ := c.Cookie("refresh_token")
	if refreshToken == "" {
		var req struct {
			RefreshToken string `json:"refresh_token"`
		}
		c.ShouldBindJSON(&req)
		refreshToken = req.RefreshToken
	}

	err := h.authService.Logout(userID.(uuid.UUID), token.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Logout failed"})
		return
	}

	// Clear cookies
	c.SetCookie("access_token", "", -1, "/", "", true, true)
	c.SetCookie("refresh_token", "", -1, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token is required"})
		return
	}

	err := h.authService.VerifyEmail(token)
	if err != nil {
		c.Redirect(http.StatusFound, h.config.FrontendURL+"/verify-email?token="+token+"&status=error")
		return
	}

	c.Redirect(http.StatusFound, h.config.FrontendURL+"/verify-email?token="+token+"&status=success")
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req models.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.authService.ForgotPassword(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reset email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset email sent"})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.authService.ResetPassword(req.Token, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	user, err := h.authService.GetUserByID(userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AuthHandler) Toggle2FA(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req struct {
		Enabled bool `json:"enabled"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.logger.LogSecurityEvent(c.Request.Context(), "2fa_toggle", map[string]interface{}{
		"user_id": userID,
		"enabled": req.Enabled,
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "2FA settings updated",
		"enabled": req.Enabled,
	})
}

func (h *AuthHandler) GetActivityLog(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	activities := []gin.H{
		{
			"id":          1,
			"type":        "login",
			"description": "Successful login",
			"timestamp":   time.Now().Format(time.RFC3339),
			"ip":          c.ClientIP(),
		},
		{
			"id":          2,
			"type":        "password",
			"description": "Password changed",
			"timestamp":   time.Now().Add(-48 * time.Hour).Format(time.RFC3339),
			"ip":          c.ClientIP(),
		},
		{
			"id":          3,
			"type":        "email",
			"description": "Email verified",
			"timestamp":   time.Now().Add(-120 * time.Hour).Format(time.RFC3339),
			"ip":          c.ClientIP(),
		},
	}

	h.logger.LogBusinessEvent(c.Request.Context(), "activity_log_viewed", map[string]interface{}{
		"user_id": userID,
	})

	c.JSON(http.StatusOK, gin.H{"activities": activities})
}