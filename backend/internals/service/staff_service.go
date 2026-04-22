package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type StaffService interface{}

type staffService struct {
	repositories repository.Repositories
}

func NewStaffService(repositories repository.Repositories) StaffService {
	return &staffService{repositories: repositories}
}
