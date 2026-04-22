package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type UserRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error)
	Create(ctx context.Context, input model.CreateUserInput) (*entity.User, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateUserInput) (*entity.User, error)
}

type userRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return &userRepository{db: db}
}

// Create implements [UserRepository].
func (u *userRepository) Create(ctx context.Context, input model.CreateUserInput) (*entity.User, error) {
	panic("unimplemented")
}

// FindByID implements [UserRepository].
func (u *userRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error) {
	panic("unimplemented")
}

// Update implements [UserRepository].
func (u *userRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateUserInput) (*entity.User, error) {
	panic("unimplemented")
}
