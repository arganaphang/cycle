package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AppointmentRepository interface {
	Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Appointment, []error)
	LoaderByPatientIDs(ctx context.Context, patientIDs []uuid.UUID) ([]*model.Appointment, []error)
	LoaderByStaffIDs(ctx context.Context, staffIDs []uuid.UUID) ([]*model.Appointment, []error)
	FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int32, offset *int32) ([]*entity.Appointment, *int32, error)
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
	stmt := goqu.Insert(entity.TABLE_APPOINTMENT).
		Rows(goqu.Record{
			"patient_id":      input.PatientID,
			"staff_id":        input.StaffID,
			"scheduled_at":    input.ScheduledAt,
			"duration_min":    input.DurationMin,
			"chief_complaint": input.ChiefComplaint,
			"notes":           input.Notes,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	appointment := entity.Appointment{}
	if err := a.db.Get(&appointment, sql); err != nil {
		return nil, err
	}
	return &appointment, nil
}

// Loader implements [AppointmentRepository].
func (a *appointmentRepository) Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Appointment, []error) {
	stmt := goqu.From(entity.TABLE_APPOINTMENT)
	sql, _, _ := stmt.Where(goqu.C("id").In(IDs)).ToSQL()
	results := []*entity.Appointment{}
	if err := a.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	appointments := []*model.Appointment{}
	for idx := range results {
		appointments = append(appointments, results[idx].ToModel())
	}
	return appointments, nil
}

// LoaderByPatientIDs implements [AppointmentRepository].
func (a *appointmentRepository) LoaderByPatientIDs(ctx context.Context, IDs []uuid.UUID) ([]*model.Appointment, []error) {
	stmt := goqu.From(entity.TABLE_APPOINTMENT)
	sql, _, _ := stmt.Where(goqu.C("patient_id").In(IDs)).ToSQL()
	results := []*entity.Appointment{}
	if err := a.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	appointments := []*model.Appointment{}
	for idx := range results {
		appointments = append(appointments, results[idx].ToModel())
	}
	return appointments, nil
}

// LoaderByStaffIDs implements [AppointmentRepository].
func (a *appointmentRepository) LoaderByStaffIDs(ctx context.Context, IDs []uuid.UUID) ([]*model.Appointment, []error) {
	stmt := goqu.From(entity.TABLE_APPOINTMENT)
	sql, _, _ := stmt.Where(goqu.C("staff_id").In(IDs)).ToSQL()
	results := []*entity.Appointment{}
	if err := a.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	appointments := []*model.Appointment{}
	for idx := range results {
		appointments = append(appointments, results[idx].ToModel())
	}
	return appointments, nil
}

// FindAll implements [AppointmentRepository].
func (a *appointmentRepository) FindAll(ctx context.Context, filter *model.AppointmentFilter, limit *int32, offset *int32) ([]*entity.Appointment, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(entity.TABLE_APPOINTMENT)

	if filter != nil && filter.PatientID != nil {
		stmt = stmt.Where(goqu.C("patient_id").Eq(*filter.PatientID))
	}
	if filter != nil && filter.StaffID != nil {
		stmt = stmt.Where(goqu.C("staff_id").Eq(*filter.StaffID))
	}
	if filter != nil && filter.Status != nil {
		stmt = stmt.Where(goqu.C("status").Eq(*filter.Status))
	}
	if filter != nil && filter.DateFrom != nil {
		stmt = stmt.Where(goqu.C("scheduled_at").Gte(*filter.DateFrom))
	}
	if filter != nil && filter.DateTo != nil {
		stmt = stmt.Where(goqu.C("scheduled_at").Gte(*filter.DateTo))
	}

	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	appointments := []*entity.Appointment{}
	if err := a.db.Select(&appointments, sql); err != nil {
		return nil, nil, err
	}
	sqlCount, _, err := stmt.Select(goqu.COUNT("*")).ToSQL()
	if err != nil {
		return nil, nil, err
	}

	var count int32
	if err := a.db.Get(&count, sqlCount); err != nil {
		return nil, nil, err
	}
	return appointments, &count, nil
}

// FindByID implements [AppointmentRepository].
func (a *appointmentRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Appointment, error) {
	sql, _, _ := goqu.From(entity.TABLE_APPOINTMENT).Where(goqu.C("id").Eq(id)).ToSQL()
	appointment := entity.Appointment{}
	if err := a.db.Get(&appointment, sql); err != nil {
		return nil, err
	}
	return &appointment, nil
}

// UpdateStatus implements [AppointmentRepository].
func (a *appointmentRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status model.UpdateAppointmentStatusInput) (*entity.Appointment, error) {
	sql, _, err := goqu.Update(entity.TABLE_APPOINTMENT).
		Set(goqu.Record{
			"status": status,
		}).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	appointment := entity.Appointment{}
	if err := a.db.Get(&appointment, sql); err != nil {
		return nil, err
	}
	return &appointment, nil
}
