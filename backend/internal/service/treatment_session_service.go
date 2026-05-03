package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type TreatmentSessionService interface {
	FindAll(ctx context.Context, filter *model.SessionFilter, limit *int32, offset *int32, sortBy *model.TreatmentSessionSortField, sortOrder *model.SortOrder) (*model.TreatmentSessionConnection, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.TreatmentSession, error)
	Create(ctx context.Context, input model.CreateTreatmentSessionInput) (*model.TreatmentSession, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*model.TreatmentSession, error)
}

type treatmentSessionService struct {
	repositories repository.Repositories
}

func NewTreatmentSessionService(repositories repository.Repositories) TreatmentSessionService {
	return &treatmentSessionService{repositories: repositories}
}

// Create implements [TreatmentSessionService].
func (t *treatmentSessionService) Create(ctx context.Context, input model.CreateTreatmentSessionInput) (*model.TreatmentSession, error) {
	result, err := t.repositories.TreatmentSessionRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindAll implements [TreatmentSessionService].
func (t *treatmentSessionService) FindAll(ctx context.Context, filter *model.SessionFilter, limit *int32, offset *int32, sortBy *model.TreatmentSessionSortField, sortOrder *model.SortOrder) (*model.TreatmentSessionConnection, error) {
	result, count, err := t.repositories.TreatmentSessionRepository.FindAll(ctx, filter, limit, offset, sortBy, sortOrder)
	if err != nil {
		return nil, err
	}
	sessions := []*model.TreatmentSession{}
	for idx := range result {
		sessions = append(sessions, result[idx].ToModel())
	}
	return &model.TreatmentSessionConnection{
		Nodes:      sessions,
		TotalCount: *count,
	}, nil
}

// FindByID implements [TreatmentSessionService].
func (t *treatmentSessionService) FindByID(ctx context.Context, id uuid.UUID) (*model.TreatmentSession, error) {
	result, err := t.repositories.TreatmentSessionRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// UpdateStatus implements [TreatmentSessionService].
func (t *treatmentSessionService) UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*model.TreatmentSession, error) {
	result, err := t.repositories.TreatmentSessionRepository.UpdateStatus(ctx, id, status)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}
