package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type UserService interface {
	FindByID(ctx context.Context, id uuid.UUID) (*model.User, error)
	Create(ctx context.Context, input model.CreateUserInput) (*model.User, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateUserInput) (*model.User, error)
}

type userService struct {
	repositories repository.Repositories
}

func NewUserService(repositories repository.Repositories) UserService {
	return &userService{repositories: repositories}
}

// Create implements [UserService].
func (u *userService) Create(ctx context.Context, input model.CreateUserInput) (*model.User, error) {
	result, err := u.repositories.UserRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindByID implements [UserService].
func (u *userService) FindByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	result, err := u.repositories.UserRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// Update implements [UserService].
func (u *userService) Update(ctx context.Context, id uuid.UUID, input model.UpdateUserInput) (*model.User, error) {
	result, err := u.repositories.UserRepository.Update(ctx, id, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}
