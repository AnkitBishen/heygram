package main

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	authHandle "github.com/AnkitBishen/heygram/auth/handlers"
	"github.com/AnkitBishen/heygram/auth/storage/pgSql"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("This service is related to authentication.")

	rootPath, err := filepath.Abs("../")
	if err != nil {
		slog.Error("failed to get absolute path", slog.String("error", err.Error()))
		return
	}

	envFilePath := filepath.Join(rootPath, ".env")
	err = godotenv.Load(envFilePath)
	if err != nil {
		slog.Error("failed to load environment variables", slog.String("error", err.Error()))
		return
	}

	// check db connectivity
	pgURI := os.Getenv("POSTGRES_URI")
	if pgURI == "" {
		slog.Error("POSTGRES_URI environment variable is not set")
		return
	}

	pdb, err := pgSql.New(pgURI)
	if err != nil {
		slog.Error("failed to connect to database", slog.String("error", err.Error()))
		return
	}

	// create initial tables if they don't exist
	err = pdb.InitialTbls()
	if err != nil {
		slog.Error("failed to create initial tables", slog.String("error", err.Error()))
		return
	}

	// start server here
	ar := gin.Default()

	ar.POST("/auth/v1/register", authHandle.Register(pdb))
	ar.POST("/auth/v1/login", authHandle.Login(pdb))

	if err := ar.Run(":8000"); err != nil {
		slog.Error("failed to run server", slog.String("error", err.Error()))
	}
}
