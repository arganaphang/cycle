package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TreatmentSessionRepository interface {
	FindAll(ctx context.Context, filter *model.SessionFilter, limit *int, offset *int) ([]*entity.TreatmentSession, *int, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSession, error)
	Create(ctx context.Context, input model.CreateSessionInput) (*entity.TreatmentSession, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*entity.TreatmentSession, error)
}

type treatmentSessionRepository struct {
	db *sqlx.DB
}

func NewTreatmentSessionRepository(db *sqlx.DB) TreatmentSessionRepository {
	return &treatmentSessionRepository{db: db}
}

// Create implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) Create(ctx context.Context, input model.CreateSessionInput) (*entity.TreatmentSession, error) {
	panic("unimplemented")
}

// FindAll implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) FindAll(ctx context.Context, filter *model.SessionFilter, limit *int, offset *int) ([]*entity.TreatmentSession, *int, error) {
	panic("unimplemented")
}

// FindByID implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSession, error) {
	panic("unimplemented")
}

// UpdateStatus implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*entity.TreatmentSession, error) {
	panic("unimplemented")
}
