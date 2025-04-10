package storage

import (
	"github.com/AnkitBishen/heygram/auth/helpers/types"
)

type Storage interface {
	SetUser(user types.RegisterRequest) error
	IsUserExists(userName string, email string) (bool, types.RegisterRequest)
}
