package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	authHandle "github.com/AnkitBishen/heygram/auth/handlers"
	"github.com/AnkitBishen/heygram/auth/helpers/cors"
	"github.com/AnkitBishen/heygram/auth/storage/pgSql"
	"github.com/AnkitBishen/heygram/common/shared"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Config struct {
	PostgresURI string
}

func LoadConfig() (*Config, error) {
	pgURI := os.Getenv("POSTGRES_URI")
	if pgURI == "" {
		return nil, fmt.Errorf("POSTGRES_URI environment variable is not set")
	}
	return &Config{PostgresURI: pgURI}, nil
}

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

	config, err := LoadConfig()
	if err != nil {
		slog.Error("failed to load config", slog.String("error", err.Error()))
		return
	}

	// connection to database
	pdb, err := pgSql.New(config.PostgresURI)
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

	ar.Use(cors.CORSMiddleware())

	// routes
	ar.POST("/auth/v1/register", authHandle.Register(pdb))
	ar.POST("/auth/v1/login", authHandle.Login(pdb))
	ar.POST("/auth/v1/logout", shared.AuthMiddleware(), authHandle.Logout(pdb))
	ar.POST("/auth/v1/profile", shared.AuthMiddleware(), authHandle.Profile(pdb))

	srv := &http.Server{
		Addr:    ":8001",
		Handler: ar,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("failed to run server", slog.String("error", err.Error()))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit
	slog.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("Server forced to shutdown", slog.String("error", err.Error()))
	}

}
