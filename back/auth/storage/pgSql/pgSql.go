package pgSql

import (
	"database/sql"
	"log/slog"

	"github.com/AnkitBishen/heygram/auth/helpers/types"
	_ "github.com/lib/pq"
)

type Psql struct {
	DB *sql.DB
}

func New(url string) (*Psql, error) {

	db, err := sql.Open("postgres", url)
	if err != nil {
		slog.Error("failed to open database", slog.String("error", err.Error()))
		return nil, err
	}

	return &Psql{DB: db}, nil
}

// IsUserExists implements storage.Storage.
func (p *Psql) IsUserExists(userName string, email string) (bool, types.RegisterRequest) {

	row := p.DB.QueryRow("SELECT * FROM users WHERE username = $1 AND email = $2", userName, email)

	var user types.RegisterRequest
	err := row.Scan(&user.Name, &user.Dob, &user.Username, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, types.RegisterRequest{}
		}
		slog.Error("failed to scan row", slog.String("error", err.Error()))
		return false, types.RegisterRequest{}
	}

	return true, user
}

// SetUser implements storage.Storage.
func (p *Psql) SetUser(user types.RegisterRequest) error {

	_, err := p.DB.Exec("INSERT INTO users (name, dob, username, email, password) VALUES ($1, $2, $3, $4, $5)", user.Name, user.Dob, user.Username, user.Email, user.Password)
	if err != nil {
		slog.Error("failed to insert user", slog.String("error", err.Error()))
		return err
	}

	return nil
}
