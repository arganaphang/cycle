package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type UserService interface{}

type userService struct {
	repositories repository.Repositories
}

func NewUserService(repositories repository.Repositories) UserService {
	return &userService{repositories: repositories}
}
