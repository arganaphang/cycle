package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AppointmentRepository interface {
	FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int, offset *int) ([]*model.Appointment, *int, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Appointment, error)
	Create(ctx context.Context, input model.CreateAppointmentInput) (*model.Appointment, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*model.Appointment, error)
	CancelStatus(ctx context.Context, id uuid.UUID) (*model.Appointment, error)
}

type appointmentRepository struct {
	db *sqlx.DB
}

func NewAppointmentRepository(db *sqlx.DB) AppointmentRepository {
	return &appointmentRepository{db: db}
}

// CancelStatus implements [AppointmentRepository].
func (a *appointmentRepository) CancelStatus(ctx context.Context, id uuid.UUID) (*model.Appointment, error) {
	panic("unimplemented")
}

// Create implements [AppointmentRepository].
func (a *appointmentRepository) Create(ctx context.Context, input model.CreateAppointmentInput) (*model.Appointment, error) {
	panic("unimplemented")
}

// FindAll implements [AppointmentRepository].
func (a *appointmentRepository) FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int, offset *int) ([]*model.Appointment, *int, error) {
	panic("unimplemented")
}

// FindByID implements [AppointmentRepository].
func (a *appointmentRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.Appointment, error) {
	panic("unimplemented")
}

// UpdateStatus implements [AppointmentRepository].
func (a *appointmentRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*model.Appointment, error) {
	panic("unimplemented")
}
