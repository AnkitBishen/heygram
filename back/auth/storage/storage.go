package storage

import (
	"github.com/AnkitBishen/heygram/auth/helpers/types"
)

type Storage interface {
	InitialTbls() error
	SetUser(user types.RegisterRequest) error
	IsUserExists(email string) (bool, types.User)
}
