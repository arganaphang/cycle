package repository

import "github.com/jmoiron/sqlx"

type TreatmentSessionRepository interface{}

type treatmentSessionRepository struct {
	db *sqlx.DB
}

func NewTreatmentSessionRepository(db *sqlx.DB) TreatmentSessionRepository {
	return &treatmentSessionRepository{db: db}
}
