package entity

import (
	"time"

	"github.com/google/uuid"
)

type Staff struct {
	ID             uuid.UUID `db:"id"             json:"id"`
	UserID         uuid.UUID `db:"user_id"        json:"user_id"`
	FullName       string    `db:"full_name"      json:"full_name"`
	Specialization *string   `db:"specialization" json:"specialization,omitempty"`
	LicenseNo      *string   `db:"license_no"     json:"license_no,omitempty"`
	Phone          *string   `db:"phone"          json:"phone,omitempty"`
	CreatedAt      time.Time `db:"created_at"     json:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"     json:"updated_at"`
}
