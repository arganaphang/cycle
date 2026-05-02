package entity

import (
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_STAFF = "staffs"

type Staff struct {
	ID             uuid.UUID `db:"id"             json:"id"`
	UserID         uuid.UUID `db:"user_id"        json:"user_id"`
	FullName       string    `db:"full_name"      json:"full_name"`
	Specialization *string   `db:"specialization" json:"specialization"`
	LicenseNo      *string   `db:"license_no"     json:"license_no"`
	Phone          *string   `db:"phone"          json:"phone"`
	CreatedAt      time.Time `db:"created_at"     json:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"     json:"updated_at"`
}

func (s Staff) ToModel() *model.Staff {
	return &model.Staff{
		ID:             s.ID,
		UserID:         s.UserID,
		FullName:       s.FullName,
		Specialization: s.Specialization,
		LicenseNo:      s.LicenseNo,
		Phone:          s.Phone,
		CreatedAt:      s.CreatedAt,
		UpdatedAt:      s.UpdatedAt,
	}
}
