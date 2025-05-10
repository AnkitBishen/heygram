package authHandle

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/AnkitBishen/heygram/auth/helpers/argon2hash"
	jwtauth "github.com/AnkitBishen/heygram/auth/helpers/jwtAuth"
	"github.com/AnkitBishen/heygram/auth/helpers/response"
	"github.com/AnkitBishen/heygram/auth/helpers/types"
	"github.com/AnkitBishen/heygram/auth/storage"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

const (
	arg2time = uint32(1)
	memory   = uint32(64 * 1024)
	threads  = uint8(4)
	keyLen   = uint32(32)
	salt     = "F62c3CgjsZJ6p0fowmHM0g"
)

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

// Register is a handler function for create new users.
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
		req.Password, err = argon2hash.HashPassword(req.Password, salt, arg2time, memory, threads, keyLen)
		if err != nil {
			fmt.Println("Error hashing password:", err)
			return
		}

		// check if user already exists
		ok, _ := pdb.IsUserExists(req.Email, req.Username)
		if ok {
			c.JSON(http.StatusConflict, response.Err{Success: false, Message: "user already exists"})
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

// Login is a handler function for validate credentials and login in software
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
		ok, user := pdb.IsUserExists("", req.Username)
		if !ok {
			c.JSON(http.StatusUnauthorized, response.Err{Success: false, Message: "Account not found"})
			return
		}

		// check password with hash
		// logs.WriteLogs("salt value: " + salt)
		valid, _ := argon2hash.VerifyPassword(req.Password, user.Password, salt, arg2time, memory, threads, keyLen)
		if !valid {
			c.JSON(http.StatusUnauthorized, response.Err{Success: false, Message: "Invalid Password"})
			return
		}

		// create token and session ID
		token, _ := jwtauth.CreateToken(user.Username)
		sessionId := RandStringBytes(32)

		// save token and session ID in cookie
		http.SetCookie(c.Writer, &http.Cookie{Name: "token", Value: token, HttpOnly: true})
		http.SetCookie(c.Writer, &http.Cookie{Name: "session_id", Value: sessionId, HttpOnly: true})

		// store login session
		var sessionParams = types.LoginSessionReq{
			UserId:     user.Id,
			SessionId:  sessionId,
			Browser:    req.Browser,
			Device:     req.Device,
			DeviceName: req.DeviceName,
		}
		err = pdb.StoreLoginSession(sessionParams)
		if err != nil {
			c.JSON(http.StatusBadRequest, response.Err{Success: false, Message: err.Error()})
			return
		}

		c.JSON(http.StatusAccepted, gin.H{"success": true, "message": "Login successful", "token": token})

	}
}

// Profile is a handler function for which return the depth details of particular user.
func Profile(pdb storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get request body
		var req types.ProfileRequest
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
		user, err := pdb.GetUser(req.Username)
		if err != nil {
			c.JSON(http.StatusUnauthorized, response.Err{Success: false, Message: "Account not found"})
			return
		}

		c.JSON(http.StatusAccepted, response.OkWithData{Success: false, Data: user, Message: ""})

	}
}

// Logout is a handler function for destory all access
func Logout(pdb storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get request body
		var req types.LogoutRequest
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

		// delete cookies
		http.SetCookie(c.Writer, &http.Cookie{Name: "token", Value: "", HttpOnly: true, Expires: time.Unix(0, 0)})
		http.SetCookie(c.Writer, &http.Cookie{Name: "session_id", Value: "", HttpOnly: true, Expires: time.Unix(0, 0)})

		// logout form current borwser or device

		c.JSON(http.StatusAccepted, response.OkWithData{Success: false, Data: "", Message: ""})

	}
}
