package types

type User struct {
	Name     string `json:"name"`
	Dob      string `json:"dob"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Name     string `json:"name" validate:"required"`
	Dob      string `json:"dob" validate:"required"`
	Username string `json:"username"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password"`
}
