package authHandle

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/AnkitBishen/heygram/auth/helpers/argon2hash"
	"github.com/AnkitBishen/heygram/auth/helpers/configmail"
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

		// hash password by using argon2 method
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

		c.JSON(http.StatusAccepted, response.Ok{Success: true, Message: "Successfully logout"})

	}
}

// ForgetPassword is a handler function for change the password
func ForgetPassword(pdb storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get request body
		var req types.ForgetPasswordReq
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

		var mesg string
		if req.ActionFrom == 1 {
			// check is there any user account exists
			ok, usrDetails := pdb.IsUserExists(req.UserId, req.UserId)
			if !ok {
				c.JSON(http.StatusConflict, response.Err{Success: false, Message: "Account not found"})
				return
			}

			// send mail
			var resetLink string = "<a href=\"http://localhost:3000/reset-password/email=\" >http://localhost:3000/reset-password</a>"
			var subject string = "Password Reset Request for Your Heygram Account"
			var body string = fmt.Sprintf(`Hello %s,

			We received a request to reset the password for your Heygram account.

			To reset your password, please click the link below:
			%s

			If you did not request a password reset, please ignore this email or contact our support team.

			Thank you,
			Heygram Team
			`, usrDetails.Username, resetLink)

			_, err := configmail.ProcessMail([]string{usrDetails.Email}, body, subject)
			if err != nil {
				c.JSON(http.StatusConflict, response.Err{Success: false, Message: "Failed to send message. please try after sometime. <br>" + err.Error()})
				return
			}
			mesg = "We've sent a password reset link to " + usrDetails.Email + ". Please check your email and follow the instructions to reset your password."

		} else if req.ActionFrom == 2 {
			// Accept new password request and update the password field
			if req.UserId == "" || req.NewPass == "" {
				c.JSON(http.StatusBadRequest, response.Err{Success: false, Message: "User ID and new password required."})
				return
			}

			// Fetch user for validation (optional, you might want to validate reset token here)
			ok, _ := pdb.IsUserExists(req.UserId, req.UserId)
			if !ok {
				c.JSON(http.StatusNotFound, response.Err{Success: false, Message: "Account not found."})
				return
			}

			// Hash new password
			hashedPwd, err := argon2hash.HashPassword(req.NewPass, salt, arg2time, memory, threads, keyLen)
			if err != nil {
				c.JSON(http.StatusInternalServerError, response.Err{Success: false, Message: "Error processing password."})
				return
			}

			// Update password in storage
			err = pdb.UpdateUserPassword(req.UserId, hashedPwd)
			if err != nil {
				c.JSON(http.StatusInternalServerError, response.Err{Success: false, Message: "Failed to update password."})
				return
			}

			mesg = "Your password has been successfully reset."
		}

		c.JSON(http.StatusAccepted, response.Ok{Success: true, Message: mesg})
	}
}
