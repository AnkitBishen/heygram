package response

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type Ok struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type Err struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func ValidationErr(errs validator.ValidationErrors) []string {

	var erMsg []string

	for _, err := range errs {
		switch err.ActualTag() {
		case "required":
			erMsg = append(erMsg, fmt.Sprintf("field %s is required", err.Field()))
		case "min":
			erMsg = append(erMsg, fmt.Sprintf("%s must be at least 8 characters", err.Field()))
		case "containsany":
			erMsg = append(erMsg, fmt.Sprintf("%s must contain at least one special character", err.Field()))
		default:
			erMsg = append(erMsg, fmt.Sprintf("field %s is invalid", err.Field()))
		}
	}

	return erMsg

}
