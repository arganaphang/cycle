package repository

import (
	"github.com/jmoiron/sqlx"
)

type StaffRepository interface {
	// FindAll(ctx context.Context)
}

type staffRepository struct {
	db *sqlx.DB
}

func NewStaffRepository(db *sqlx.DB) StaffRepository {
	return &staffRepository{db: db}
}
