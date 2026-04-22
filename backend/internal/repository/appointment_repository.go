package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AppointmentRepository interface {
	FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int, offset *int) ([]*entity.Appointment, *int, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Appointment, error)
	Create(ctx context.Context, input model.CreateAppointmentInput) (*entity.Appointment, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*entity.Appointment, error)
}

type appointmentRepository struct {
	db *sqlx.DB
}

func NewAppointmentRepository(db *sqlx.DB) AppointmentRepository {
	return &appointmentRepository{db: db}
}

// Create implements [AppointmentRepository].
func (a *appointmentRepository) Create(ctx context.Context, input model.CreateAppointmentInput) (*entity.Appointment, error) {
	panic("unimplemented")
}

// FindAll implements [AppointmentRepository].
func (a *appointmentRepository) FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int, offset *int) ([]*entity.Appointment, *int, error) {
	panic("unimplemented")
}

// FindByID implements [AppointmentRepository].
func (a *appointmentRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Appointment, error) {
	panic("unimplemented")
}

// UpdateStatus implements [AppointmentRepository].
func (a *appointmentRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*entity.Appointment, error) {
	panic("unimplemented")
}
