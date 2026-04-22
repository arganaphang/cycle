package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SoapNoteRepository interface {
	FindAll(ctx context.Context, limit *int, offset *int) ([]*model.SOAPNote, *int, error)
	FindAllBySessionID(ctx context.Context, sessionID uuid.UUID) ([]*model.SOAPNote, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.SOAPNote, error)
	Create(ctx context.Context, input model.CreateSOAPNoteInput) (*model.SOAPNote, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*model.SOAPNote, error)
}

type soapNoteRepository struct {
	db *sqlx.DB
}

func NewSoapNoteRepository(db *sqlx.DB) SoapNoteRepository {
	return &soapNoteRepository{db: db}
}

// Create implements [SoapNoteRepository].
func (s *soapNoteRepository) Create(ctx context.Context, input model.CreateSOAPNoteInput) (*model.SOAPNote, error) {
	panic("unimplemented")
}

// FindAll implements [SoapNoteRepository].
func (s *soapNoteRepository) FindAll(ctx context.Context, limit *int, offset *int) ([]*model.SOAPNote, *int, error) {
	panic("unimplemented")
}

// FindAllBySessionID implements [SoapNoteRepository].
func (s *soapNoteRepository) FindAllBySessionID(ctx context.Context, sessionID uuid.UUID) ([]*model.SOAPNote, error) {
	panic("unimplemented")
}

// FindByID implements [SoapNoteRepository].
func (s *soapNoteRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.SOAPNote, error) {
	panic("unimplemented")
}

// Update implements [SoapNoteRepository].
func (s *soapNoteRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*model.SOAPNote, error) {
	panic("unimplemented")
}
