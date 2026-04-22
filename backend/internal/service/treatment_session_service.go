package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type TreatmentSessionService interface{}

type treatmentSessionService struct {
	repositories repository.Repositories
}

func NewTreatmentSessionService(repositories repository.Repositories) TreatmentSessionService {
	return &treatmentSessionService{repositories: repositories}
}
