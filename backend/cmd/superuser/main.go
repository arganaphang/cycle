// Command superuser creates an ADMIN (super) user in the database.
//
// Uses the same env vars as the API server: DATABASE_USER, DATABASE_NAME, DATABASE_PASS.
//
// Example:
//
//	go run ./cmd/superuser -email=admin@example.com -password='secret'
//
// Password can be omitted when SUPERUSER_PASSWORD is set (avoids shell history).
package main

import (
	"context"
	"database/sql"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/arganaphang/cycle/backend/internal/service"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	email := flag.String("email", "", "email for the admin user (required)")
	password := flag.String("password", "", "password (optional if env SUPERUSER_PASSWORD is set)")
	flag.Parse()

	if *email == "" {
		flag.Usage()
		log.Fatal("missing -email")
	}

	pw := *password
	if pw == "" {
		pw = os.Getenv("SUPERUSER_PASSWORD")
	}
	if pw == "" {
		log.Fatal("set -password or environment variable SUPERUSER_PASSWORD")
	}

	db, err := sqlx.Connect("postgres", fmt.Sprintf(
		"user=%s dbname=%s password=%s sslmode=disable",
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_NAME"),
		os.Getenv("DATABASE_PASS"),
	))
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()
	repos := repository.NewRepositories(db)

	if _, err := repos.UserRepository.FindByEmail(ctx, *email); err == nil {
		log.Fatalf("user already exists: %s", *email)
	} else if !errors.Is(err, sql.ErrNoRows) {
		log.Fatalf("lookup user: %v", err)
	}

	svc := service.NewServices(repos)
	user, err := svc.UserService.Create(ctx, model.CreateUserInput{
		Email:    *email,
		Password: pw,
		Role:     model.UserRoleAdmin,
	})
	if err != nil {
		log.Fatalf("create user: %v", err)
	}

	log.Printf("created super user: id=%s email=%s role=%s", user.ID, user.Email, user.Role)
}
