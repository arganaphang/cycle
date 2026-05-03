package repository

import (
	"context"
	"fmt"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TreatmentSessionRepository interface {
	Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.TreatmentSession, []error)
	LoaderByPatientIDs(ctx context.Context, patientIDs []uuid.UUID) ([][]*model.TreatmentSession, []error)
	FindAll(ctx context.Context, filter *model.SessionFilter, limit *int32, offset *int32) ([]*entity.TreatmentSession, *int32, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSession, error)
	Create(ctx context.Context, input model.CreateTreatmentSessionInput) (*entity.TreatmentSession, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*entity.TreatmentSession, error)
}

type treatmentSessionRepository struct {
	db *sqlx.DB
}

func NewTreatmentSessionRepository(db *sqlx.DB) TreatmentSessionRepository {
	return &treatmentSessionRepository{db: db}
}

// Create implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) Create(ctx context.Context, input model.CreateTreatmentSessionInput) (*entity.TreatmentSession, error) {
	tx, err := t.db.BeginTxx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Per migration: session_no = next index for this patient (1-based).
	var sessionNo int32
	const nextNoQuery = `SELECT COALESCE(MAX(session_no), 0) + 1 FROM treatment_sessions WHERE patient_id = $1`
	if err := tx.GetContext(ctx, &sessionNo, nextNoQuery, input.PatientID); err != nil {
		return nil, err
	}

	stmt := goqu.Insert(entity.TABLE_TREATMENT_SESSION).
		Rows(goqu.Record{
			"patient_id":   input.PatientID,
			"staff_id":     input.StaffID,
			"session_date": input.SessionDate,
			"session_no":   sessionNo,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	session := entity.TreatmentSession{}
	if err := tx.GetContext(ctx, &session, sql); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &session, nil
}

// Loader implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.TreatmentSession, []error) {
	stmt := goqu.From(entity.TABLE_TREATMENT_SESSION)
	sql, _, _ := stmt.Where(goqu.C("id").In(IDs)).ToSQL()
	results := []*entity.TreatmentSession{}
	if err := t.db.Select(&results, sql); err != nil {
		errors := make([]error, len(IDs))
		for idx := range errors {
			errors[idx] = err
		}
		return nil, errors
	}

	sessionsByID := make(map[uuid.UUID]*model.TreatmentSession, len(results))
	for _, result := range results {
		sessionsByID[result.ID] = result.ToModel()
	}

	sessions := make([]*model.TreatmentSession, len(IDs))
	errors := make([]error, len(IDs))
	for idx, id := range IDs {
		session, ok := sessionsByID[id]
		if !ok {
			errors[idx] = fmt.Errorf("treatment session not found: %s", id)
			continue
		}
		sessions[idx] = session
	}
	return sessions, errors
}

// LoaderByPatientIDs implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) LoaderByPatientIDs(ctx context.Context, patientIDs []uuid.UUID) ([][]*model.TreatmentSession, []error) {
	stmt := goqu.From(entity.TABLE_TREATMENT_SESSION)
	sql, _, _ := stmt.Where(goqu.C("patient_id").In(patientIDs)).ToSQL()
	results := []*entity.TreatmentSession{}
	if err := t.db.Select(&results, sql); err != nil {
		errors := make([]error, len(patientIDs))
		for idx := range errors {
			errors[idx] = err
		}
		return nil, errors
	}

	sessionsByPatientID := make(map[uuid.UUID][]*model.TreatmentSession, len(patientIDs))
	for _, result := range results {
		sessionsByPatientID[result.PatientID] = append(sessionsByPatientID[result.PatientID], result.ToModel())
	}

	sessions := make([][]*model.TreatmentSession, len(patientIDs))
	for idx, patientID := range patientIDs {
		sessions[idx] = sessionsByPatientID[patientID]
	}

	return sessions, nil
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

	if filter != nil && filter.PatientID != nil {
		stmt = stmt.Where(goqu.C("patient_id").Eq(filter.PatientID))
	}
	if filter != nil && filter.StaffID != nil {
		stmt = stmt.Where(goqu.C("staff_id").Eq(filter.StaffID))
	}
	if filter != nil && filter.Status != nil {
		stmt = stmt.Where(goqu.C("status").Eq(filter.Status))
	}
	if filter != nil && filter.DateFrom != nil {
		stmt = stmt.Where(goqu.C("session_date").Gte(filter.DateFrom))
	}
	if filter != nil && filter.DateTo != nil {
		stmt = stmt.Where(goqu.C("session_date").Lte(filter.DateTo))
	}

	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	sessions := []*entity.TreatmentSession{}
	if err := t.db.Select(&sessions, sql); err != nil {
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
	return sessions, &count, nil
}

// FindByID implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSession, error) {
	sql, _, _ := goqu.From(entity.TABLE_TREATMENT_SESSION).Where(goqu.C("id").Eq(id)).ToSQL()
	session := entity.TreatmentSession{}
	if err := t.db.Get(&session, sql); err != nil {
		return nil, err
	}
	return &session, nil
}

// UpdateStatus implements [TreatmentSessionRepository].
func (t *treatmentSessionRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status model.SessionStatus) (*entity.TreatmentSession, error) {
	sql, _, err := goqu.Update(entity.TABLE_TREATMENT_SESSION).
		Set(goqu.Record{
			"status": status,
		}).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	session := entity.TreatmentSession{}
	if err := t.db.Get(&session, sql); err != nil {
		return nil, err
	}
	return &session, nil
}
