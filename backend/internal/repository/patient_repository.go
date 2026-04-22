package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PatientRepository interface {
	FindAll(ctx context.Context, search *string, limit *int, offset *int) ([]*entity.Patient, *int, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Patient, error)
	Create(ctx context.Context, input model.CreatePatientInput) (*entity.Patient, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdatePatientInput) (*entity.Patient, error)
}

type patientRepository struct {
	db *sqlx.DB
}

func NewPatientRepository(db *sqlx.DB) PatientRepository {
	return &patientRepository{db: db}
}

// Create implements [PatientRepository].
func (p *patientRepository) Create(ctx context.Context, input model.CreatePatientInput) (*entity.Patient, error) {
	panic("unimplemented")
}

// FindAll implements [PatientRepository].
func (p *patientRepository) FindAll(ctx context.Context, search *string, limit *int, offset *int) ([]*entity.Patient, *int, error) {
	panic("unimplemented")
}

// FindByID implements [PatientRepository].
func (p *patientRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Patient, error) {
	panic("unimplemented")
}

// Update implements [PatientRepository].
func (p *patientRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdatePatientInput) (*entity.Patient, error) {
	panic("unimplemented")
}
