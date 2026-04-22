package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SoapNoteRepository interface {
	FindAll(ctx context.Context, limit *int, offset *int) ([]*entity.SOAPNote, *int, error)
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
	panic("unimplemented")
}

// FindAll implements [SoapNoteRepository].
func (s *soapNoteRepository) FindAll(ctx context.Context, limit *int, offset *int) ([]*entity.SOAPNote, *int, error) {
	panic("unimplemented")
}

// FindBySessionID implements [SoapNoteRepository].
func (s *soapNoteRepository) FindBySessionID(ctx context.Context, sessionID uuid.UUID) (*entity.SOAPNote, error) {
	panic("unimplemented")
}

// FindByID implements [SoapNoteRepository].
func (s *soapNoteRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.SOAPNote, error) {
	panic("unimplemented")
}

// Update implements [SoapNoteRepository].
func (s *soapNoteRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*entity.SOAPNote, error) {
	panic("unimplemented")
}
