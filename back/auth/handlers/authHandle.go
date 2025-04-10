package authHandle

import (
	"encoding/json"
	"strings"

	"github.com/AnkitBishen/heygram/auth/helpers/response"
	"github.com/AnkitBishen/heygram/auth/helpers/types"
	"github.com/AnkitBishen/heygram/auth/storage"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func Register(pdb storage.Storage) gin.HandlerFunc {
	return func(c *gin.Context) {

		// get request body
		var req types.RegisterRequest
		err := json.NewDecoder(c.Request.Body).Decode(&req)
		if err != nil {
			c.JSON(400, response.Err{Success: false, Message: err.Error()})
			return
		}

		// validate request
		validator_new := validator.New()
		verr := validator_new.Struct(req)
		if verr != nil {
			validationErrors := verr.(validator.ValidationErrors)
			arrOferr := response.ValidationErr(validationErrors)
			errs := strings.Join(arrOferr, ", ")

			c.JSON(400, response.Err{Success: false, Message: errs})
			return
		}

		// hash password

		// check if user already exists
		ok, _ := pdb.IsUserExists(req.Username, req.Email)
		if ok {
			c.JSON(400, response.Err{Success: false, Message: "user already exists"})
			return
		}

		// create user
		err = pdb.SetUser(req)
		if err != nil {
			c.JSON(400, response.Err{Success: false, Message: err.Error()})
			return
		}

		c.JSON(200, response.Ok{Success: true, Message: "user created"})

	}
}
