package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type PatientService interface {
	FindAll(ctx context.Context, search *string, limit *int32, offset *int32) (*model.PatientConnection, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Patient, error)
	Create(ctx context.Context, input model.CreatePatientInput) (*model.Patient, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdatePatientInput) (*model.Patient, error)
}

type patientService struct {
	repositories repository.Repositories
}

func NewPatientService(repositories repository.Repositories) PatientService {
	return &patientService{repositories: repositories}
}

// Create implements [PatientService].
func (p *patientService) Create(ctx context.Context, input model.CreatePatientInput) (*model.Patient, error) {
	result, err := p.repositories.PatientRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindAll implements [PatientService].
func (p *patientService) FindAll(ctx context.Context, search *string, limit *int32, offset *int32) (*model.PatientConnection, error) {
	result, count, err := p.repositories.PatientRepository.FindAll(ctx, search, limit, offset)
	if err != nil {
		return nil, err
	}
	patients := []*model.Patient{}
	for idx := range result {
		patients = append(patients, result[idx].ToModel())
	}
	return &model.PatientConnection{
		Nodes:      patients,
		TotalCount: *count,
	}, nil
}

// FindByID implements [PatientService].
func (p *patientService) FindByID(ctx context.Context, id uuid.UUID) (*model.Patient, error) {
	result, err := p.repositories.PatientRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// Update implements [PatientService].
func (p *patientService) Update(ctx context.Context, id uuid.UUID, input model.UpdatePatientInput) (*model.Patient, error) {
	result, err := p.repositories.PatientRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}
