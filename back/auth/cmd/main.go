package main

import (
	"fmt"
	"log/slog"
	"path/filepath"

	"github.com/AnkitBishen/heygram/auth/database/pgSql"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("This service is related to authentication.")

	rootPath, _ := filepath.Abs("../")

	envFilePath := filepath.Join(rootPath, ".env")
	err := godotenv.Load(envFilePath)
	if err != nil {
		slog.Error("failed to load environment variables", slog.String("error: ", err.Error()))
		return
	}

	// check db connectivity
	_, err = pgSql.New()
	if err != nil {
		slog.Error("failed to connect to database", slog.String("error: ", err.Error()))
	}
}
