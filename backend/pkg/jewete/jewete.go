package jewete

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// CustomClaims remains the same to wrap standard and custom data
type CustomClaims[T any] struct {
	Data T `json:"data"`
	jwt.RegisteredClaims
}

// GenerateToken is a standalone generic function
func GenerateToken[T any](secret []byte, data T, duration time.Duration) (string, error) {
	claims := CustomClaims[T]{
		Data: data,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secret)
}

// VerifyToken parses the string back into the generic type
func VerifyToken[T any](secret []byte, tokenString string) (T, error) {
	var zero T

	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims[T]{}, func(t *jwt.Token) (any, error) {
		return secret, nil
	})
	if err != nil {
		return zero, err
	}

	if claims, ok := token.Claims.(*CustomClaims[T]); ok && token.Valid {
		return claims.Data, nil
	}

	return zero, errors.New("invalid token")
}
