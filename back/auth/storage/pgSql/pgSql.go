package pgSql

import (
	"database/sql"
	"log/slog"
	"time"

	"github.com/AnkitBishen/heygram/auth/helpers/types"
	_ "github.com/lib/pq"
)

type Psql struct {
	DB *sql.DB
}

// stablish postgresql db connection
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
	_, err := p.DB.Exec("CREATE TABLE IF NOT EXISTS users (id serial PRIMARY KEY, username text, email text UNIQUE NOT NULL, password text, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
	if err != nil {
		slog.Error("failed to create users table", slog.String("error", err.Error()))
		return err
	}

	// login session table
	_, err = p.DB.Exec("CREATE TABLE IF NOT EXISTS login_session (id serial PRIMARY KEY, userId text, session_id text, browser text, device text, deviceName text)")
	if err != nil {
		slog.Error("failed to create login session table", slog.String("error", err.Error()))
		return err
	}

	// user profiles table
	_, err = p.DB.Exec("CREATE TABLE IF NOT EXISTS user_profiles (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, full_name VARCHAR(255), phone_number VARCHAR(20), dob text, gender VARCHAR(10), avatar_url TEXT )")
	if err != nil {
		slog.Error("failed to create user profiles table", slog.String("error", err.Error()))
		return err
	}

	return nil
}

// check is User Exists by email or username
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

// insert user in user tbl as well as user profile table
func (p *Psql) SetUser(user types.RegisterRequest) error {
	created_at := time.Now().Format("2006-01-02 15:04:05")

	// Postgres does not support LastInsertId, so use RETURNING id
	var uId int
	err := p.DB.QueryRow(
		"INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING id",
		user.Username, user.Email, user.Password, created_at,
	).Scan(&uId)
	if err != nil {
		slog.Error("failed to insert user", slog.String("error", err.Error()))
		return err
	}

	_, err = p.DB.Exec(
		"INSERT INTO user_profiles (user_id, full_name, phone_number, dob, gender, avatar_url) VALUES ($1, $2, $3, $4, $5, $6)",
		uId, user.Name, "", user.Dob, "", "",
	)
	if err != nil {
		slog.Error("failed to insert user profile", slog.String("error", err.Error()))
		return err
	}

	return nil
}

// get user form db by it's username
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

// store user login session
func (p *Psql) StoreLoginSession(session types.LoginSessionReq) error {
	_, err := p.DB.Exec("INSERT INTO login_session (userId, session_id, browser, device, deviceName) VALUES ($1, $2, $3, $4, $5)", session.UserId, session.SessionId, session.Browser, session.Device, session.DeviceName)
	if err != nil {
		return err
	}

	return nil
}

// UpdateUserPassword updates the password for a user identified by userId.
// Returns an error if the update fails.
func (p *Psql) UpdateUserPassword(userId string, newPassword string) error {
	_, err := p.DB.Exec(
		"UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
		newPassword, userId,
	)
	if err != nil {
		slog.Error("failed to update user password", slog.String("error", err.Error()))
		return err
	}
	return nil
}
