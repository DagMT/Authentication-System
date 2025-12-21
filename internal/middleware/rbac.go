package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Flack74/go-auth-system/internal/models"
)

// RequirePermission middleware checks if user has required permission
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userPermissions, exists := c.Get("userPermissions")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		permissions := userPermissions.([]string)
		for _, p := range permissions {
			if p == permission {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
		c.Abort()
	}
}

// RequireRole middleware checks if user has required role
func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("userRole")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		if userRole.(string) != role {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient role"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireAnyRole middleware checks if user has any of the required roles
func RequireAnyRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("userRole")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		currentRole := userRole.(string)
		for _, role := range roles {
			if currentRole == role {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient role"})
		c.Abort()
	}
}

// AdminOnly middleware - shorthand for admin access
func AdminOnly() gin.HandlerFunc {
	return RequireRole(models.RoleAdmin)
}

// ModeratorOrAdmin middleware - allows moderators and admins
func ModeratorOrAdmin() gin.HandlerFunc {
	return RequireAnyRole(models.RoleModerator, models.RoleAdmin)
}