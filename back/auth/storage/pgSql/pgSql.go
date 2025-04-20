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

	// login session table
	_, err = p.DB.Exec("CREATE TABLE IF NOT EXISTS loginSession (id serial PRIMARY KEY, userId text, session_id text)")
	if err != nil {
		slog.Error("failed to create loginSession table", slog.String("error", err.Error()))
		return err
	}

	return nil
}

// check is User Exists
func (p *Psql) IsUserExists(email string, username string) (bool, types.User) {

	row := p.DB.QueryRow("SELECT * FROM users WHERE email = $1 or username = $2", email, username)

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

func (p *Psql) GetUser(userName string) (types.User, error) {

	row := p.DB.QueryRow("SELECT * FROM users WHERE username = $1", userName)

	var user types.User
	err := row.Scan(&user.Id, &user.Name, &user.Dob, &user.Username, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return types.User{}, err
		}
		slog.Error("failed to scan row", slog.String("error", err.Error()))
		return types.User{}, err
	}

	return user, nil
}

// StoreLoginSession
func (p *Psql) StoreLoginSession(session types.LoginSessionReq) error {
	_, err := p.DB.Exec("INSERT INTO loginSession (userId, session_id) VALUES ($1, $2)", session.UserId, session.SessionId)
	if err != nil {
		return err
	}

	return nil
}
