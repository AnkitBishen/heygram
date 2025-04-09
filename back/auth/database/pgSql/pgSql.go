package pgSql

import (
	"database/sql"
	"log/slog"
	"os"

	_ "github.com/lib/pq"
)

type Psql struct {
	DB *sql.DB
}

func New() (*Psql, error) {

	var pgURI string = os.Getenv("POSTGRES_URI")

	db, err := sql.Open("postgres", pgURI)
	if err != nil {
		slog.Error("failed to open database", slog.String("error", err.Error()))
		return nil, err
	}

	return &Psql{DB: db}, nil
}
