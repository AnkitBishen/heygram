package shared

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("secret")

func ValidateJWT(tokenString string) (*jwt.Token, error) {
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	return token, nil
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// JWT Cookie read karo
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// JWT Verify karo
		token, err := ValidateJWT(cookie.Value)
		if err != nil || !token.Valid {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		// User session validate karo
		sessionCookie, err := r.Cookie("session_id")
		if err != nil || sessionCookie.Value == "" {
			http.Error(w, "Session Expired", http.StatusUnauthorized)
			return
		}

		// Request Allow karo
		next.ServeHTTP(w, r)
	})
}
