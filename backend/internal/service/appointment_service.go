package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type AppointmentService interface {
	FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int32, offset *int32) (*model.AppointmentConnection, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Appointment, error)
	Create(ctx context.Context, input model.CreateAppointmentInput) (*model.Appointment, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*model.Appointment, error)
	CancelStatus(ctx context.Context, id uuid.UUID) (*model.Appointment, error)
}

type appointmentService struct {
	repositories repository.Repositories
}

func NewAppointmentService(repositories repository.Repositories) AppointmentService {
	return &appointmentService{repositories: repositories}
}

// CancelStatus implements [AppointmentService].
func (a *appointmentService) CancelStatus(ctx context.Context, id uuid.UUID) (*model.Appointment, error) {
	result, err := a.repositories.AppointmentRepository.UpdateStatus(ctx, id, model.UpdateAppointmentStatusInput{
		Status: model.AppointmentStatusCancelled,
	})
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// Create implements [AppointmentService].
func (a *appointmentService) Create(ctx context.Context, input model.CreateAppointmentInput) (*model.Appointment, error) {
	result, err := a.repositories.AppointmentRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindAll implements [AppointmentService].
func (a *appointmentService) FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int32, offset *int32) (*model.AppointmentConnection, error) {
	result, count, err := a.repositories.AppointmentRepository.FindAll(ctx, filter, limit, offset)
	if err != nil {
		return nil, err
	}
	appointments := []*model.Appointment{}
	for idx := range result {
		appointments = append(appointments, result[idx].ToModel())
	}
	return &model.AppointmentConnection{
		Nodes:      appointments,
		TotalCount: *count,
	}, nil
}

// FindByID implements [AppointmentService].
func (a *appointmentService) FindByID(ctx context.Context, id uuid.UUID) (*model.Appointment, error) {
	result, err := a.repositories.AppointmentRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// UpdateStatus implements [AppointmentService].
func (a *appointmentService) UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*model.Appointment, error) {
	result, err := a.repositories.AppointmentRepository.UpdateStatus(ctx, id, status)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}
