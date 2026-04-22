package service

import (
	"context"
	"os"
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/arganaphang/cycle/backend/pkg/jewete"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Login(ctx context.Context, input model.LoginInput) (*model.AuthPayload, error)
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

// Login implements [UserService].
func (u *userService) Login(ctx context.Context, input model.LoginInput) (*model.AuthPayload, error) {
	// ? Get User
	userExist, err := u.repositories.UserRepository.FindByEmail(ctx, input.Email)
	if err != nil {
		return nil, err
	}
	// ? Compare Password
	if err := bcrypt.CompareHashAndPassword([]byte(userExist.PasswordHash), []byte(input.Password)); err != nil {
		return nil, err
	}
	// ? Create Token
	token, err := jewete.GenerateToken([]byte(os.Getenv("SECRET_KEY")), *userExist, time.Hour*24*30)
	if err != nil {
		return nil, err
	}
	// ? Return Data
	return &model.AuthPayload{
		Token: token,
		User:  userExist.ToModel(),
	}, nil
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
