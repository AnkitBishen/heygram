package authHandle

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strings"

	jwtauth "github.com/AnkitBishen/heygram/auth/helpers/jwtAuth"
	"github.com/AnkitBishen/heygram/auth/helpers/response"
	"github.com/AnkitBishen/heygram/auth/helpers/types"
	"github.com/AnkitBishen/heygram/auth/storage"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func Register(pdb storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get request body
		var req types.RegisterRequest
		err := json.NewDecoder(c.Request.Body).Decode(&req)
		if err != nil {
			c.JSON(http.StatusBadRequest, response.Err{Success: false, Message: err.Error()})
			return
		}
		defer c.Request.Body.Close()

		// validate request
		validator_new := validator.New()
		verr := validator_new.Struct(req)
		if verr != nil {
			validationErrors := verr.(validator.ValidationErrors)
			arrOferr := response.ValidationErr(validationErrors)
			errs := strings.Join(arrOferr, ", ")

			c.JSON(http.StatusUnprocessableEntity, response.Err{Success: false, Message: errs})
			return
		}

		// hash password

		// check if user already exists
		ok, _ := pdb.IsUserExists(req.Email)
		if ok {
			c.JSON(400, response.Err{Success: false, Message: "user already exists"})
			return
		}

		// create user
		err = pdb.SetUser(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, response.Err{Success: false, Message: err.Error()})
			return
		}

		c.JSON(http.StatusAccepted, response.Ok{Success: true, Message: "user created"})

	}
}

func Login(pdb storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get request body
		var req types.LoginRequest
		err := json.NewDecoder(c.Request.Body).Decode(&req)
		if err != nil {
			c.JSON(http.StatusBadRequest, response.Err{Success: false, Message: err.Error()})
			return
		}
		defer c.Request.Body.Close()

		// validate request
		validator_new := validator.New()
		verr := validator_new.Struct(req)
		if verr != nil {
			validationErrors := verr.(validator.ValidationErrors)
			arrOferr := response.ValidationErr(validationErrors)
			errs := strings.Join(arrOferr, ", ")

			c.JSON(http.StatusUnprocessableEntity, response.Err{Success: false, Message: errs})
			return
		}

		// validate credentials
		ok, user := pdb.IsUserExists(req.Username)
		if !ok {
			c.JSON(http.StatusUnauthorized, response.Err{Success: false, Message: "Account not found"})
			return
		}

		// check password with hash
		if user.Password != req.Password {
			c.JSON(http.StatusUnauthorized, response.Err{Success: false, Message: "Invalid credentials"})
			return
		}

		// create token and session ID
		token, _ := jwtauth.CreateToken(user.Username)
		sessionId := RandStringBytes(32)

		// save token and session ID in cookie
		http.SetCookie(c.Writer, &http.Cookie{Name: "token", Value: token, HttpOnly: true})
		http.SetCookie(c.Writer, &http.Cookie{Name: "session_id", Value: sessionId, HttpOnly: true})

		c.JSON(http.StatusAccepted, gin.H{"success": true, "message": "Login successful", "token": token})

	}
}
