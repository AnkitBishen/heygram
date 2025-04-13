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

// create initial table
func (p *Psql) InitialTbls() error {

	// users table
	_, err := p.DB.Exec("CREATE TABLE IF NOT EXISTS users (id serial PRIMARY KEY, name text, dob text, username text, email text, password text)")
	if err != nil {
		slog.Error("failed to create users table", slog.String("error", err.Error()))
		return err
	}

	return nil
}

// check is User Exists
func (p *Psql) IsUserExists(email string) (bool, types.User) {

	row := p.DB.QueryRow("SELECT * FROM users WHERE email = $1", email)

	var user types.User
	err := row.Scan(&user.Id, &user.Name, &user.Dob, &user.Username, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, types.User{}
		}
		slog.Error("failed to scan row", slog.String("error", err.Error()))
		return false, types.User{}
	}

	return true, user
}

// insert user
func (p *Psql) SetUser(user types.RegisterRequest) error {

	_, err := p.DB.Exec("INSERT INTO users (name, dob, username, email, password) VALUES ($1, $2, $3, $4, $5)", user.Name, user.Dob, user.Username, user.Email, user.Password)
	if err != nil {
		slog.Error("failed to insert user", slog.String("error", err.Error()))
		return err
	}

	return nil
}
