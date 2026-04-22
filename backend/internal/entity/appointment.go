package entity

import (
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_APPOINTMENT = "appointments"

type AppointmentStatus string

const (
	AppointmentStatusScheduled AppointmentStatus = "SCHEDULED"
	AppointmentStatusConfirmed AppointmentStatus = "CONFIRMED"
	AppointmentStatusCompleted AppointmentStatus = "COMPLETED"
	AppointmentStatusCancelled AppointmentStatus = "CANCELLED"
	AppointmentStatusNoShow    AppointmentStatus = "NO_SHOW"
)

// Appointment — scheduling
type Appointment struct {
	ID             uuid.UUID         `db:"id"              json:"id"`
	PatientID      uuid.UUID         `db:"patient_id"      json:"patient_id"`
	StaffID        uuid.UUID         `db:"staff_id"        json:"staff_id"`
	ScheduledAt    time.Time         `db:"scheduled_at"    json:"scheduled_at"`
	DurationMin    int32             `db:"duration_min"    json:"duration_min"`
	Status         AppointmentStatus `db:"status"          json:"status"`
	ChiefComplaint *string           `db:"chief_complaint" json:"chief_complaint,omitempty"`
	Notes          *string           `db:"notes"           json:"notes,omitempty"`
	CreatedAt      time.Time         `db:"created_at"      json:"created_at"`
	UpdatedAt      time.Time         `db:"updated_at"      json:"updated_at"`
}

func (a Appointment) ToModel() *model.Appointment {
	return &model.Appointment{
		ID:             a.ID,
		PatientID:      a.PatientID,
		StaffID:        a.StaffID,
		ScheduledAt:    a.ScheduledAt,
		DurationMin:    a.DurationMin,
		Status:         model.AppointmentStatus(a.Status),
		ChiefComplaint: a.ChiefComplaint,
		Notes:          a.Notes,
		CreatedAt:      a.CreatedAt,
		UpdatedAt:      a.UpdatedAt,
	}
}
