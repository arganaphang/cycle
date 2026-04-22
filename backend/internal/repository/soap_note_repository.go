package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SoapNoteRepository interface {
	LoaderByTreatmentSessionIDs(ctx context.Context, treatmentSessionIDs []uuid.UUID) ([]*model.SOAPNote, []error)
	FindAll(ctx context.Context, limit *int32, offset *int32) ([]*entity.SOAPNote, *int32, error)
	FindBySessionID(ctx context.Context, sessionID uuid.UUID) (*entity.SOAPNote, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.SOAPNote, error)
	Create(ctx context.Context, input model.CreateSOAPNoteInput) (*entity.SOAPNote, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*entity.SOAPNote, error)
}

type soapNoteRepository struct {
	db *sqlx.DB
}

func NewSoapNoteRepository(db *sqlx.DB) SoapNoteRepository {
	return &soapNoteRepository{db: db}
}

// Create implements [SoapNoteRepository].
func (s *soapNoteRepository) Create(ctx context.Context, input model.CreateSOAPNoteInput) (*entity.SOAPNote, error) {
	stmt := goqu.Insert(entity.TABLE_SOAP_NOTE).
		Rows(goqu.Record{
			"sessionId":  input.SessionID,
			"subjective": input.Subjective,
			"objective":  input.Objective,
			"assessment": input.Assessment,
			"plan":       input.Plan,
			"pain_scale": input.PainScale,
			"vitals":     input.Vitals,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	soapNote := entity.SOAPNote{}
	if err := s.db.Get(&soapNote, sql); err != nil {
		return nil, err
	}
	return &soapNote, nil
}

// LoaderByTreatmentSessionIDs implements [SoapNoteRepository].
func (s *soapNoteRepository) LoaderByTreatmentSessionIDs(ctx context.Context, treatmentSessionIDs []uuid.UUID) ([]*model.SOAPNote, []error) {
	stmt := goqu.From(entity.TABLE_SOAP_NOTE)
	sql, _, _ := stmt.Where(goqu.C("session_id").In(treatmentSessionIDs)).ToSQL()
	results := []*entity.SOAPNote{}
	if err := s.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	soapNotes := []*model.SOAPNote{}
	for idx := range results {
		soapNotes = append(soapNotes, results[idx].ToModel())
	}
	return soapNotes, nil
}

// FindAll implements [SoapNoteRepository].
func (s *soapNoteRepository) FindAll(ctx context.Context, limit *int32, offset *int32) ([]*entity.SOAPNote, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(entity.TABLE_SOAP_NOTE)
	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	soapNotes := []*entity.SOAPNote{}
	if err := s.db.Select(&soapNotes, sql); err != nil {
		return nil, nil, err
	}
	sqlCount, _, err := stmt.Select(goqu.COUNT("*")).ToSQL()
	if err != nil {
		return nil, nil, err
	}

	var count int32
	if err := s.db.Get(&count, sqlCount); err != nil {
		return nil, nil, err
	}
	return soapNotes, &count, nil
}

// FindBySessionID implements [SoapNoteRepository].
func (s *soapNoteRepository) FindBySessionID(ctx context.Context, sessionID uuid.UUID) (*entity.SOAPNote, error) {
	sql, _, _ := goqu.From(entity.TABLE_SOAP_NOTE).Where(goqu.C("session_id").Eq(sessionID)).ToSQL()
	soapNote := entity.SOAPNote{}
	if err := s.db.Get(&soapNote, sql); err != nil {
		return nil, err
	}
	return &soapNote, nil
}

// FindByID implements [SoapNoteRepository].
func (s *soapNoteRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.SOAPNote, error) {
	sql, _, _ := goqu.From(entity.TABLE_SOAP_NOTE).Where(goqu.C("id").Eq(id)).ToSQL()
	soapNote := entity.SOAPNote{}
	if err := s.db.Get(&soapNote, sql); err != nil {
		return nil, err
	}
	return &soapNote, nil
}

// Update implements [SoapNoteRepository].
func (s *soapNoteRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*entity.SOAPNote, error) {
	stmt := goqu.Update(entity.TABLE_SOAP_NOTE).
		Set(goqu.Record{
			"subjective": input.Subjective,
			"objective":  input.Objective,
			"assessment": input.Assessment,
			"plan":       input.Plan,
			"pain_scale": input.PainScale,
			"vitals":     input.Vitals,
		}).
		Where(goqu.C("id").Eq(id)).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	soapNote := entity.SOAPNote{}
	if err := s.db.Get(&soapNote, sql); err != nil {
		return nil, err
	}
	return &soapNote, nil
}
