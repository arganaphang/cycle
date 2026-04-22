package service

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
)

type StaffService interface {
	FindAll(ctx context.Context, search *string, limit *int32, offset *int32) (*model.StaffConnection, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Staff, error)
	Create(ctx context.Context, input model.CreateStaffInput) (*model.Staff, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*model.Staff, error)
}

type staffService struct {
	repositories repository.Repositories
}

func NewStaffService(repositories repository.Repositories) StaffService {
	return &staffService{repositories: repositories}
}

// Create implements [StaffService].
func (s *staffService) Create(ctx context.Context, input model.CreateStaffInput) (*model.Staff, error) {
	result, err := s.repositories.StaffRepository.Create(ctx, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// FindAll implements [StaffService].
func (s *staffService) FindAll(ctx context.Context, search *string, limit *int32, offset *int32) (*model.StaffConnection, error) {
	result, count, err := s.repositories.StaffRepository.FindAll(ctx, search, limit, offset)
	if err != nil {
		return nil, err
	}
	staffs := []*model.Staff{}
	for idx := range result {
		staffs = append(staffs, result[idx].ToModel())
	}
	return &model.StaffConnection{
		Nodes:      staffs,
		TotalCount: *count,
	}, nil
}

// FindByID implements [StaffService].
func (s *staffService) FindByID(ctx context.Context, id uuid.UUID) (*model.Staff, error) {
	result, err := s.repositories.StaffRepository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}

// Update implements [StaffService].
func (s *staffService) Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*model.Staff, error) {
	result, err := s.repositories.StaffRepository.Update(ctx, id, input)
	if err != nil {
		return nil, err
	}
	return result.ToModel(), nil
}
