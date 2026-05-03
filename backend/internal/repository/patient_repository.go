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

type PatientRepository interface {
	Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Patient, []error)
	FindAll(ctx context.Context, search *string, limit *int32, offset *int32) ([]*entity.Patient, *int32, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Patient, error)
	Create(ctx context.Context, input model.CreatePatientInput) (*entity.Patient, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdatePatientInput) (*entity.Patient, error)
}

type patientRepository struct {
	db *sqlx.DB
}

func NewPatientRepository(db *sqlx.DB) PatientRepository {
	return &patientRepository{db: db}
}

// Create implements [PatientRepository].
func (p *patientRepository) Create(ctx context.Context, input model.CreatePatientInput) (*entity.Patient, error) {
	stmt := goqu.Insert(entity.TABLE_PATIENT).
		Rows(goqu.Record{
			"medical_record_no": fmt.Sprintf("MRN-%s", uuid.NewString()[:8]),
			"full_name":         input.FullName,
			"date_of_birth":     input.DateOfBirth,
			"gender":            input.Gender,
			"phone":             input.Phone,
			"email":             input.Email,
			"address":           input.Address,
			"emergency_contact": input.EmergencyContact,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	patient := entity.Patient{}
	if err := p.db.Get(&patient, sql); err != nil {
		return nil, err
	}
	return &patient, nil
}

// Loader implements [PatientRepository].
func (p *patientRepository) Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Patient, []error) {
	stmt := goqu.From(entity.TABLE_PATIENT)
	sql, _, _ := stmt.Where(goqu.C("id").In(IDs)).ToSQL()
	results := []*entity.Patient{}
	if err := p.db.Select(&results, sql); err != nil {
		errors := make([]error, len(IDs))
		for idx := range errors {
			errors[idx] = err
		}
		return nil, errors
	}

	patientsByID := make(map[uuid.UUID]*model.Patient, len(results))
	for _, result := range results {
		patientsByID[result.ID] = result.ToModel()
	}

	patients := make([]*model.Patient, len(IDs))
	errors := make([]error, len(IDs))
	for idx, id := range IDs {
		patient, ok := patientsByID[id]
		if !ok {
			errors[idx] = fmt.Errorf("patient not found: %s", id)
			continue
		}
		patients[idx] = patient
	}
	return patients, errors
}

// FindAll implements [PatientRepository].
func (p *patientRepository) FindAll(ctx context.Context, search *string, limit *int32, offset *int32) ([]*entity.Patient, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(entity.TABLE_PATIENT)

	if search != nil {
		stmt = stmt.Where(goqu.C("full_name").ILike(fmt.Sprintf("%s%%", *search)))
	}

	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	patients := []*entity.Patient{}
	if err := p.db.Select(&patients, sql); err != nil {
		return nil, nil, err
	}
	sqlCount, _, err := stmt.Select(goqu.COUNT("*")).ToSQL()
	if err != nil {
		return nil, nil, err
	}

	var count int32
	if err := p.db.Get(&count, sqlCount); err != nil {
		return nil, nil, err
	}
	return patients, &count, nil
}

// FindByID implements [PatientRepository].
func (p *patientRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Patient, error) {
	sql, _, _ := goqu.From(entity.TABLE_PATIENT).Where(goqu.C("id").Eq(id)).ToSQL()
	patient := entity.Patient{}
	if err := p.db.Get(&patient, sql); err != nil {
		return nil, err
	}
	return &patient, nil
}

// Update implements [PatientRepository].
func (p *patientRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdatePatientInput) (*entity.Patient, error) {
	records := goqu.Record{}
	if input.FullName != nil {
		records["full_name"] = *input.FullName
	}
	if input.Phone != nil {
		records["phone"] = *input.Phone
	}
	if input.Email != nil {
		records["email"] = *input.Email
	}
	if input.Address != nil {
		records["address"] = *input.Address
	}
	if input.EmergencyContact != nil {
		records["emergency_contact"] = *input.EmergencyContact
	}
	sql, _, err := goqu.Update(entity.TABLE_PATIENT).
		Set(records).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	patient := entity.Patient{}
	if err := p.db.Get(&patient, sql); err != nil {
		return nil, err
	}
	return &patient, nil
}
