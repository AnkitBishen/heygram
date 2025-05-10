package argon2hash

import (
	"crypto/rand"
	"encoding/base64"

	"golang.org/x/crypto/argon2"
)

// GenerateSalt creates a random salt
func GenerateSalt(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.RawStdEncoding.EncodeToString(bytes), nil
}

// HashPassword hashes the password using Argon2id with the given parameters
func HashPassword(password string, salt string, time uint32, memory uint32, threads uint8, keyLen uint32) (string, error) {

	saltBytes, err := base64.RawStdEncoding.DecodeString(salt)
	if err != nil {
		return "", err
	}

	hashedPassword := argon2.IDKey([]byte(password), saltBytes, time, memory, threads, keyLen)
	b64HashedPassword := base64.RawStdEncoding.EncodeToString(hashedPassword)
	return b64HashedPassword, nil
}

// VerifyPassword checks if the provided password matches the hashed password
func VerifyPassword(password string, hashedPassword string, salt string, time uint32, memory uint32, threads uint8, keyLen uint32) (bool, error) {

	hashedPasswordFromInput, err := HashPassword(password, salt, time, memory, threads, keyLen)
	if err != nil {
		return false, err
	}

	return hashedPassword == hashedPasswordFromInput, nil
}
