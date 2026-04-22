package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type SoapNoteService interface {
	FindAll(ctx context.Context, limit *int32, offset *int32) ([]*model.SOAPNote, *int32, error)
	FindBySessionID(ctx context.Context, sessionID uuid.UUID) (*model.SOAPNote, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.SOAPNote, error)
	Create(ctx context.Context, input model.CreateSOAPNoteInput) (*model.SOAPNote, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*model.SOAPNote, error)
}

type soapNoteService struct {
	repositories repository.Repositories
}

func NewSoapNoteService(repositories repository.Repositories) SoapNoteService {
	return &soapNoteService{repositories: repositories}
}

// Create implements [SoapNoteService].
func (s *soapNoteService) Create(ctx context.Context, input model.CreateSOAPNoteInput) (*model.SOAPNote, error) {
	result, err := s.repositories.SoapNoteRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindAll implements [SoapNoteService].
func (s *soapNoteService) FindAll(ctx context.Context, limit *int32, offset *int32) ([]*model.SOAPNote, *int32, error) {
	result, count, err := s.repositories.SoapNoteRepository.FindAll(ctx, limit, offset)
	if err != nil {
		return nil, nil, err
	}
	notes := []*model.SOAPNote{}
	for idx := range result {
		notes = append(notes, result[idx].ToModel())
	}
	return notes, count, nil
}

// FindBySessionID implements [SoapNoteService].
func (s *soapNoteService) FindBySessionID(ctx context.Context, sessionID uuid.UUID) (*model.SOAPNote, error) {
	result, err := s.repositories.SoapNoteRepository.FindBySessionID(ctx, sessionID)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindByID implements [SoapNoteService].
func (s *soapNoteService) FindByID(ctx context.Context, id uuid.UUID) (*model.SOAPNote, error) {
	result, err := s.repositories.SoapNoteRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// Update implements [SoapNoteService].
func (s *soapNoteService) Update(ctx context.Context, id uuid.UUID, input model.UpdateSOAPNoteInput) (*model.SOAPNote, error) {
	result, err := s.repositories.SoapNoteRepository.Update(ctx, id, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}
