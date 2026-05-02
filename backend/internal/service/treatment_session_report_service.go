package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type TreatmentSessionReportService interface {
	FindAll(ctx context.Context, filter *model.ReportFilter, limit *int32, offset *int32) (*model.TreatmentSessionReportConnection, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.TreatmentSessionReport, error)
	Create(ctx context.Context, input model.CreateTreatmentSessionReportInput) (*model.TreatmentSessionReport, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateTreatmentSessionReportInput) (*model.TreatmentSessionReport, error)
}

type treatmentSessionReportService struct {
	repositories repository.Repositories
}

func NewTreatmentSessionReportService(repositories repository.Repositories) TreatmentSessionReportService {
	return &treatmentSessionReportService{repositories: repositories}
}

// Create implements [TreatmentSessionReportService].
func (t *treatmentSessionReportService) Create(ctx context.Context, input model.CreateTreatmentSessionReportInput) (*model.TreatmentSessionReport, error) {
	result, err := t.repositories.TreatmentSessionReportRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), err
}

// FindAll implements [TreatmentSessionReportService].
func (t *treatmentSessionReportService) FindAll(ctx context.Context, filter *model.ReportFilter, limit *int32, offset *int32) (*model.TreatmentSessionReportConnection, error) {
	result, count, err := t.repositories.TreatmentSessionReportRepository.FindAll(ctx, filter, limit, offset)
	if err != nil {
		return nil, err
	}
	sessions := []*model.TreatmentSessionReport{}
	for idx := range result {
		sessions = append(sessions, result[idx].ToModel())
	}
	return &model.TreatmentSessionReportConnection{
		Nodes:      sessions,
		TotalCount: *count,
	}, nil
}

// FindByID implements [TreatmentSessionReportService].
func (t *treatmentSessionReportService) FindByID(ctx context.Context, id uuid.UUID) (*model.TreatmentSessionReport, error) {
	result, err := t.repositories.TreatmentSessionReportRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), err
}

// Update implements [TreatmentSessionReportService].
func (t *treatmentSessionReportService) Update(ctx context.Context, id uuid.UUID, input model.UpdateTreatmentSessionReportInput) (*model.TreatmentSessionReport, error) {
	result, err := t.repositories.TreatmentSessionReportRepository.Update(ctx, id, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), err
}
