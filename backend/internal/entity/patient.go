package entity

import (
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_PATIENT = "patients"

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
	Phone            *string           `db:"phone"               json:"phone"`
	Email            *string           `db:"email"               json:"email"`
	Address          *string           `db:"address"             json:"address"`
	EmergencyContact *EmergencyContact `db:"emergency_contact"   json:"emergency_contact"`
	CreatedAt        time.Time         `db:"created_at"          json:"created_at"`
	UpdatedAt        time.Time         `db:"updated_at"          json:"updated_at"`
}

func (p Patient) ToModel() *model.Patient {
	var emergencyContact *model.EmergencyContact
	if p.EmergencyContact != nil {
		emergencyContact = &model.EmergencyContact{
			Name:     p.EmergencyContact.Name,
			Phone:    p.EmergencyContact.Phone,
			Relation: p.EmergencyContact.Relation,
		}
	}
	return &model.Patient{
		ID:               p.ID,
		MedicalRecordNo:  p.MedicalRecordNo,
		FullName:         p.FullName,
		DateOfBirth:      p.DateOfBirth,
		Gender:           model.Gender(p.Gender),
		Phone:            p.Phone,
		Email:            p.Email,
		Address:          p.Address,
		EmergencyContact: emergencyContact,
		CreatedAt:        p.CreatedAt,
		UpdatedAt:        p.UpdatedAt,
	}
}
