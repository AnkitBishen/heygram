package types

type User struct {
	Id       int    `json:"id"`
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
	Password string `json:"password" validate:"required"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}
type ProfileRequest struct {
	Username string `json:"username" validate:"required"`
}

type LoginSessionReq struct {
	UserId    int    `json:"userId"`
	SessionId string `json:"sessionid"`
	// Expire
}
