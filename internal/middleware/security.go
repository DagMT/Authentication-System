package middleware

import (
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/Flack74/go-auth-system/internal/utils"
)

// SecurityHeaders middleware adds security headers
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Header("Content-Security-Policy", "default-src 'self'")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

// InputSanitization middleware sanitizes request inputs
func InputSanitization() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check for common XSS patterns in headers
		userAgent := c.GetHeader("User-Agent")
		if containsXSS(userAgent) {
			logger := utils.NewLogger()
			logger.LogSecurityEvent(c.Request.Context(), "xss_attempt_header", map[string]interface{}{
				"user_agent": userAgent,
				"ip":         c.ClientIP(),
			})
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			c.Abort()
			return
		}

		// Check Authorization header for XSS
		authHeader := c.GetHeader("Authorization")
		if containsXSS(authHeader) {
			logger := utils.NewLogger()
			logger.LogSecurityEvent(c.Request.Context(), "xss_attempt_auth", map[string]interface{}{
				"ip": c.ClientIP(),
			})
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid authorization"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequestSizeLimit middleware limits request body size
func RequestBodySizeLimit(maxSize int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxSize)
		c.Next()
	}
}

// containsXSS checks for common XSS patterns
func containsXSS(input string) bool {
	if input == "" {
		return false
	}

	// Common XSS patterns
	xssPatterns := []string{
		`<script`,
		`javascript:`,
		`onload=`,
		`onerror=`,
		`onclick=`,
		`onmouseover=`,
		`<iframe`,
		`<object`,
		`<embed`,
		`<link`,
		`<meta`,
		`<style`,
		`expression\(`,
		`url\(`,
		`@import`,
	}

	lowerInput := strings.ToLower(input)
	for _, pattern := range xssPatterns {
		if strings.Contains(lowerInput, pattern) {
			return true
		}
	}

	// Check for encoded XSS attempts
	encodedPatterns := []string{
		`%3Cscript`,
		`%3C%73%63%72%69%70%74`,
		`&lt;script`,
		`&#60;script`,
	}

	for _, pattern := range encodedPatterns {
		if strings.Contains(lowerInput, pattern) {
			return true
		}
	}

	return false
}

// SQLInjectionProtection middleware checks for SQL injection patterns
func SQLInjectionProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check query parameters
		for key, values := range c.Request.URL.Query() {
			for _, value := range values {
				if containsSQLInjection(value) {
					logger := utils.NewLogger()
					logger.LogSecurityEvent(c.Request.Context(), "sql_injection_attempt", map[string]interface{}{
						"parameter": key,
						"value":     value,
						"ip":        c.ClientIP(),
					})
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
					c.Abort()
					return
				}
			}
		}
		c.Next()
	}
}

// containsSQLInjection checks for common SQL injection patterns
func containsSQLInjection(input string) bool {
	if input == "" {
		return false
	}

	// SQL injection patterns
	sqlPatterns := []*regexp.Regexp{
		regexp.MustCompile(`(?i)(union\s+select)`),
		regexp.MustCompile(`(?i)(drop\s+table)`),
		regexp.MustCompile(`(?i)(delete\s+from)`),
		regexp.MustCompile(`(?i)(insert\s+into)`),
		regexp.MustCompile(`(?i)(update\s+.+set)`),
		regexp.MustCompile(`(?i)(or\s+1\s*=\s*1)`),
		regexp.MustCompile(`(?i)(and\s+1\s*=\s*1)`),
		regexp.MustCompile(`(?i)('.*or.*'.*=.*')`),
		regexp.MustCompile(`(?i)(exec\s*\()`),
		regexp.MustCompile(`(?i)(script\s*\()`),
	}

	for _, pattern := range sqlPatterns {
		if pattern.MatchString(input) {
			return true
		}
	}

	return false
}