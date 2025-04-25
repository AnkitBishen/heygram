package shared

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const (
	// GinContextUserKey is used to store user info in Gin context
	GinContextUserKey = "user"
	// Replace this with a secure secret in production!
	jwtSecret = "secret"
)

// AuthMiddleware is a middleware for Gin that validates JWT tokens and stores claims in the Gin context.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(401, gin.H{"error": "Missing or malformed Authorization header"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := jwt.MapClaims{}

		// Parse and validate the token
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			// Always check the signing method!
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(401, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store claims in Gin context for handler access
		c.Set(GinContextUserKey, claims)
		c.Next()
	}
}

// GetUserClaims extracts JWT claims from the Gin context (to be used in handlers)
func GetUserClaims(c *gin.Context) (jwt.MapClaims, bool) {
	claims, exists := c.Get(GinContextUserKey)
	if claims == nil || !exists {
		return nil, false
	}
	mapClaims, ok := claims.(jwt.MapClaims)
	return mapClaims, ok
}
