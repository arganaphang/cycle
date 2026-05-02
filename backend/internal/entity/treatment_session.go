package entity

import (
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_TREATMENT_SESSION = "treatment_sessions"

type SessionStatus string

const (
	SessionStatusScheduled  SessionStatus = "SCHEDULED"
	SessionStatusInProgress SessionStatus = "IN_PROGRESS"
	SessionStatusCompleted  SessionStatus = "COMPLETED"
	SessionStatusCancelled  SessionStatus = "CANCELLED"
)

type TreatmentSession struct {
	ID          uuid.UUID     `db:"id"             json:"id"`
	PatientID   uuid.UUID     `db:"patient_id"     json:"patient_id"`
	StaffID     uuid.UUID     `db:"staff_id"       json:"staff_id"`
	SessionDate time.Time     `db:"session_date"   json:"session_date"`
	SessionNo   int32         `db:"session_no"     json:"session_no"`
	Status      SessionStatus `db:"status"         json:"status"`
	CreatedAt   time.Time     `db:"created_at"     json:"created_at"`
	UpdatedAt   time.Time     `db:"updated_at"     json:"updated_at"`
}

func (t TreatmentSession) ToModel() *model.TreatmentSession {
	return &model.TreatmentSession{
		ID:          t.ID,
		PatientID:   t.PatientID,
		StaffID:     t.StaffID,
		SessionDate: t.SessionDate,
		SessionNo:   t.SessionNo,
		Status:      model.SessionStatus(t.Status),
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
	}
}
