package entity

import (
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_TREATMENT_SESSION_REPORT = "treatment_session_reports"

type TreatmentSessionReport struct {
	ID                   uuid.UUID `db:"id"                     json:"id"`
	SessionID            uuid.UUID `db:"session_id"             json:"session_id"`
	Anamnesis            *string   `db:"anamnesis"              json:"anamnesis"`
	MechanismOfInjury    *string   `db:"mechanism_of_injury"    json:"mechanism_of_injury"`
	ActualCondition      *string   `db:"actual_condition"       json:"actual_condition"`
	Examination          *string   `db:"examination"            json:"examination"`
	Diagnosis            *string   `db:"diagnosis"              json:"diagnosis"`
	Intervention         *string   `db:"intervention"           json:"intervention"`
	PlanningAndEducation *string   `db:"planning_and_education" json:"planning_and_education"`
	CreatedAt            time.Time `db:"created_at"             json:"created_at"`
	UpdatedAt            time.Time `db:"updated_at"             json:"updated_at"`
}

func (t TreatmentSessionReport) ToModel() *model.TreatmentSessionReport {
	return &model.TreatmentSessionReport{
		ID:                   t.ID,
		SessionID:            t.SessionID,
		Anamnesis:            t.Anamnesis,
		MechanismOfInjury:    t.MechanismOfInjury,
		ActualCondition:      t.ActualCondition,
		Examination:          t.Examination,
		Diagnosis:            t.Diagnosis,
		Intervention:         t.Intervention,
		PlanningAndEducation: t.PlanningAndEducation,
		CreatedAt:            t.CreatedAt,
		UpdatedAt:            t.UpdatedAt,
	}
}
