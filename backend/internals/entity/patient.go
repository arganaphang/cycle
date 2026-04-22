package entity

import (
	"time"

	"github.com/google/uuid"
)

type EmergencyContact struct {
	Name     string `json:"name"`
	Phone    string `json:"phone"`
	Relation string `json:"relation"`
}

type Patient struct {
	ID               uuid.UUID         `db:"id"                  json:"id"`
	MedicalRecordNo  string            `db:"medical_record_no"   json:"medical_record_no"`
	FullName         string            `db:"full_name"           json:"full_name"`
	DateOfBirth      time.Time         `db:"date_of_birth"       json:"date_of_birth"`
	Gender           Gender            `db:"gender"              json:"gender"`
	Phone            *string           `db:"phone"               json:"phone,omitempty"`
	Email            *string           `db:"email"               json:"email,omitempty"`
	Address          *string           `db:"address"             json:"address,omitempty"`
	EmergencyContact *EmergencyContact `db:"emergency_contact"   json:"emergency_contact,omitempty"`
	CreatedAt        time.Time         `db:"created_at"          json:"created_at"`
	UpdatedAt        time.Time         `db:"updated_at"          json:"updated_at"`
}
