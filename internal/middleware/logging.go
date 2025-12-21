package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/Flack74/go-auth-system/internal/utils"
)

// CorrelationID middleware adds correlation ID to each request
func CorrelationID() gin.HandlerFunc {
	return func(c *gin.Context) {
		correlationID := c.GetHeader("X-Correlation-ID")
		if correlationID == "" {
			correlationID = uuid.New().String()
		}
		
		// Set in context for use throughout request
		ctx := utils.SetCorrelationID(c.Request.Context(), correlationID)
		c.Request = c.Request.WithContext(ctx)
		
		// Add to response headers
		c.Header("X-Correlation-ID", correlationID)
		c.Set("correlation_id", correlationID)
		
		c.Next()
	}
}

// StructuredLogging middleware with correlation ID
func StructuredLogging(logger *utils.Logger) gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		correlationID := ""
		if id, exists := param.Keys["correlation_id"]; exists {
			correlationID = id.(string)
		}

		entry := logger.WithFields(logrus.Fields{
			"correlation_id": correlationID,
			"status":         param.StatusCode,
			"latency":        param.Latency,
			"client_ip":      param.ClientIP,
			"method":         param.Method,
			"path":           param.Path,
			"user_agent":     param.Request.UserAgent(),
		})

		if param.ErrorMessage != "" {
			entry = entry.WithField("error", param.ErrorMessage)
		}

		// Log level based on status code
		if param.StatusCode >= 500 {
			entry.Error("HTTP Request")
		} else if param.StatusCode >= 400 {
			entry.Warn("HTTP Request")
		} else {
			entry.Info("HTTP Request")
		}

		return "" // Return empty string since we're using structured logging
	})
}

// RequestMetrics middleware for performance monitoring
func RequestMetrics() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		
		c.Next()
		
		duration := time.Since(start)
		
		// Log slow requests
		if duration > 1*time.Second {
			logger := utils.NewLogger()
			logger.WithCorrelationID(c.Request.Context()).WithFields(logrus.Fields{
				"method":   c.Request.Method,
				"path":     c.Request.URL.Path,
				"duration": duration,
				"status":   c.Writer.Status(),
			}).Warn("Slow request detected")
		}
	}
}