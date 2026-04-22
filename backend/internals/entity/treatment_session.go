package entity

import (
	"time"

	"github.com/google/uuid"
)

type SessionStatus string

const (
	SessionStatusInProgress SessionStatus = "IN_PROGRESS"
	SessionStatusCompleted  SessionStatus = "COMPLETED"
	SessionStatusCancelled  SessionStatus = "CANCELLED"
)

type TreatmentSession struct {
	ID            uuid.UUID     `db:"id"             json:"id"`
	AppointmentID *uuid.UUID    `db:"appointment_id" json:"appointment_id,omitempty"` // nil = walk-in
	PatientID     uuid.UUID     `db:"patient_id"     json:"patient_id"`
	StaffID       uuid.UUID     `db:"staff_id"       json:"staff_id"`
	SessionDate   time.Time     `db:"session_date"   json:"session_date"`
	SessionNo     int           `db:"session_no"     json:"session_no"`
	Status        SessionStatus `db:"status"         json:"status"`
	CreatedAt     time.Time     `db:"created_at"     json:"created_at"`
	UpdatedAt     time.Time     `db:"updated_at"     json:"updated_at"`
}
