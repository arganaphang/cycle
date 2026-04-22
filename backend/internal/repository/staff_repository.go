package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type StaffRepository interface {
	FindAll(ctx context.Context, search *string, limit *int, offset *int) ([]*entity.Staff, *int, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Staff, error)
	Create(ctx context.Context, input model.CreateStaffInput) (*entity.Staff, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*entity.Staff, error)
}

type staffRepository struct {
	db *sqlx.DB
}

func NewStaffRepository(db *sqlx.DB) StaffRepository {
	return &staffRepository{db: db}
}

// Create implements [StaffRepository].
func (s *staffRepository) Create(ctx context.Context, input model.CreateStaffInput) (*entity.Staff, error) {
	panic("unimplemented")
}

// FindAll implements [StaffRepository].
func (s *staffRepository) FindAll(ctx context.Context, search *string, limit *int, offset *int) ([]*entity.Staff, *int, error) {
	panic("unimplemented")
}

// FindByID implements [StaffRepository].
func (s *staffRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Staff, error) {
	panic("unimplemented")
}

// Update implements [StaffRepository].
func (s *staffRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*entity.Staff, error) {
	panic("unimplemented")
}
