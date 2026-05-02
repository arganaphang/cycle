package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TreatmentSessionReportRepository interface {
	FindAll(ctx context.Context, filter *model.ReportFilter, limit *int32, offset *int32) ([]*entity.TreatmentSessionReport, *int32, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSessionReport, error)
	LoaderBySessionIDs(ctx context.Context, sessionIDs []uuid.UUID) ([]*model.TreatmentSessionReport, []error)
	Create(ctx context.Context, input model.CreateTreatmentSessionReportInput) (*entity.TreatmentSessionReport, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateTreatmentSessionReportInput) (*entity.TreatmentSessionReport, error)
}

type treatmentSessionReportRepository struct {
	db *sqlx.DB
}

func NewTreatmentSessionReportRepository(db *sqlx.DB) TreatmentSessionReportRepository {
	return &treatmentSessionReportRepository{db: db}
}

// Create implements [TreatmentSessionReportRepository].
func (t *treatmentSessionReportRepository) Create(ctx context.Context, input model.CreateTreatmentSessionReportInput) (*entity.TreatmentSessionReport, error) {
	records := goqu.Record{
		"session_id": input.SessionID,
	}
	if input.Anamnesis != nil {
		records["anamnesis"] = *input.Anamnesis
	}
	if input.MechanismOfInjury != nil {
		records["mechanism_of_injury"] = *input.MechanismOfInjury
	}
	if input.ActualCondition != nil {
		records["actual_condition"] = *input.ActualCondition
	}
	if input.Examination != nil {
		records["examination"] = *input.Examination
	}
	if input.Diagnosis != nil {
		records["diagnosis"] = *input.Diagnosis
	}
	if input.Intervention != nil {
		records["intervention"] = *input.Intervention
	}
	if input.PlanningAndEducation != nil {
		records["planning_and_education"] = *input.PlanningAndEducation
	}
	stmt := goqu.Insert(entity.TABLE_TREATMENT_SESSION_REPORT).
		Rows(records).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	report := entity.TreatmentSessionReport{}
	if err := t.db.Get(&report, sql); err != nil {
		return nil, err
	}
	return &report, nil
}

// FindAll implements [TreatmentSessionReportRepository].
func (t *treatmentSessionReportRepository) FindAll(ctx context.Context, filter *model.ReportFilter, limit *int32, offset *int32) ([]*entity.TreatmentSessionReport, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(entity.TABLE_TREATMENT_SESSION_REPORT)

	if filter != nil && filter.DateFrom != nil {
		stmt = stmt.Where(goqu.C("created_at").Gte(filter.DateFrom))
	}
	if filter != nil && filter.DateTo != nil {
		stmt = stmt.Where(goqu.C("created_at").Lte(filter.DateTo))
	}

	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	reports := []*entity.TreatmentSessionReport{}
	if err := t.db.Select(&reports, sql); err != nil {
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
	return reports, &count, nil
}

// FindByID implements [TreatmentSessionReportRepository].
func (t *treatmentSessionReportRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.TreatmentSessionReport, error) {
	sql, _, _ := goqu.From(entity.TABLE_TREATMENT_SESSION_REPORT).Where(goqu.C("id").Eq(id)).ToSQL()
	reports := entity.TreatmentSessionReport{}
	if err := t.db.Get(&reports, sql); err != nil {
		return nil, err
	}
	return &reports, nil
}

// LoaderBySessionIDs implements [TreatmentSessionReportRepository].
func (t *treatmentSessionReportRepository) LoaderBySessionIDs(ctx context.Context, sessionIDs []uuid.UUID) ([]*model.TreatmentSessionReport, []error) {
	stmt := goqu.From(entity.TABLE_TREATMENT_SESSION_REPORT)
	sql, _, _ := stmt.Where(goqu.C("session_id").In(sessionIDs)).ToSQL()
	results := []*entity.TreatmentSessionReport{}
	if err := t.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	reports := []*model.TreatmentSessionReport{}
	for idx := range results {
		reports = append(reports, results[idx].ToModel())
	}
	return reports, nil
}

// Update implements [TreatmentSessionReportRepository].
func (t *treatmentSessionReportRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateTreatmentSessionReportInput) (*entity.TreatmentSessionReport, error) {
	records := goqu.Record{}
	if input.Anamnesis != nil {
		records["anamnesis"] = *input.Anamnesis
	}
	if input.MechanismOfInjury != nil {
		records["mechanism_of_injury"] = *input.MechanismOfInjury
	}
	if input.ActualCondition != nil {
		records["actual_condition"] = *input.ActualCondition
	}
	if input.Examination != nil {
		records["examination"] = *input.Examination
	}
	if input.Diagnosis != nil {
		records["diagnosis"] = *input.Diagnosis
	}
	if input.Intervention != nil {
		records["intervention"] = *input.Intervention
	}
	if input.PlanningAndEducation != nil {
		records["planning_and_education"] = *input.PlanningAndEducation
	}
	sql, _, err := goqu.Update(entity.TABLE_TREATMENT_SESSION_REPORT).
		Set(records).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	report := entity.TreatmentSessionReport{}
	if err := t.db.Get(&report, sql); err != nil {
		return nil, err
	}
	return &report, nil
}
