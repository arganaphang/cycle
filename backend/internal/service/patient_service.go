package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type PatientService interface{}

type patientService struct {
	repositories repository.Repositories
}

func NewPatientService(repositories repository.Repositories) PatientService {
	return &patientService{repositories: repositories}
}
