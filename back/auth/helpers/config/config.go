package config

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type Config struct {
	PostgresURI string
	RootPath    string
}

func Load() (*Config, error) {
	rootPath, err := filepath.Abs("../")
	if err != nil {
		slog.Error("failed to get absolute path", slog.String("error", err.Error()))
		return &Config{}, err
	}

	envFilePath := filepath.Join(rootPath, ".env")
	err = godotenv.Load(envFilePath)
	if err != nil {
		slog.Error("failed to load environment variables", slog.String("error", err.Error()))
		return &Config{}, err
	}

	pgURI := os.Getenv("POSTGRES_URI")
	if pgURI == "" {
		return &Config{}, fmt.Errorf("POSTGRES_URI environment variable is not set")
	}

	return &Config{
		PostgresURI: pgURI,
		RootPath:    rootPath,
	}, nil
}
