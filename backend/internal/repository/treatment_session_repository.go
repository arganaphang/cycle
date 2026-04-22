package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TreatmentSessionRepository interface {
	FindAll(ctx context.Context, filter *model.SessionFilter, limit *int32, offset *int32) ([]*entity.TreatmentSession, *int32, error)
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
	stmt := goqu.Insert(entity.TABLE_TREATMENT_SESSION).
		Rows(goqu.Record{
			"appointment_id": input.AppointmentID,
			"patient_id":     input.PatientID,
			"staff_id":       input.StaffID,
			"session_date":   input.SessionDate,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	treatmentSession := entity.TreatmentSession{}
	if err := t.db.Get(&treatmentSession, sql); err != nil {
		return nil, err
	}
	return &treatmentSession, nil
}

// FindAll implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) FindAll(ctx context.Context, filter *model.SessionFilter, limit *int32, offset *int32) ([]*entity.TreatmentSession, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(entity.TABLE_TREATMENT_SESSION)

	if filter.PatientID != nil {
		stmt = stmt.Where(goqu.C("patient_id").Eq(filter.PatientID))
	}
	if filter.StaffID != nil {
		stmt = stmt.Where(goqu.C("staff_id").Eq(filter.StaffID))
	}
	if filter.Status != nil {
		stmt = stmt.Where(goqu.C("status").Eq(filter.Status))
	}
	if filter.DateFrom != nil {
		stmt = stmt.Where(goqu.C("session_date").Gte(filter.DateFrom))
	}
	if filter.DateTo != nil {
		stmt = stmt.Where(goqu.C("session_date").Gte(filter.DateTo))
	}

	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	treatmentSessions := []*entity.TreatmentSession{}
	if err := t.db.Select(&treatmentSessions, sql); err != nil {
		return nil, nil, err
	}
	sqlCount, _, err := stmt.Select(goqu.COUNT("*")).ToSQL()
	if err != nil {
		return nil, nil, err
	}

	var count int32
	if err := t.db.Get(&count, sqlCount); err != nil {
		return nil, nil, err
	}
	return treatmentSessions, &count, nil
}

// FindByID implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSession, error) {
	sql, _, _ := goqu.From(entity.TABLE_TREATMENT_SESSION).Where(goqu.C("id").Eq(id)).ToSQL()
	treatmentSession := entity.TreatmentSession{}
	if err := t.db.Get(&treatmentSession, sql); err != nil {
		return nil, err
	}
	return &treatmentSession, nil
}

// UpdateStatus implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*entity.TreatmentSession, error) {
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
	treatmentSession := entity.TreatmentSession{}
	if err := t.db.Get(&treatmentSession, sql); err != nil {
		return nil, err
	}
	return &treatmentSession, nil
}
