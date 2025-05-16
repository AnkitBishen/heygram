package storage

import (
	"github.com/AnkitBishen/heygram/auth/helpers/types"
)

type Storage interface {
	InitialTbls() error
	SetUser(user types.RegisterRequest) error
	IsUserExists(email string, username string) (bool, types.User)

	GetUser(userName string) (types.User, error)

	StoreLoginSession(sessionParams types.LoginSessionReq) error
	UpdateUserPassword(userId string, newPass string) error
}
