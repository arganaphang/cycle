package entity

import (
	"encoding/json"
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_SOAP_NOTE = "soap_notes"

type Vitals struct {
	BP     *string  `json:"bp,omitempty"`     // e.g. "120/80"
	HR     *int32   `json:"hr,omitempty"`     // beats per minute
	SpO2   *int32   `json:"spo2,omitempty"`   // percentage
	Temp   *float64 `json:"temp,omitempty"`   // celsius
	Weight *float64 `json:"weight,omitempty"` // kg
}

func (v Vitals) MarshalJSON() ([]byte, error) { return json.Marshal(v) }
func (v *Vitals) UnmarshalJSON(b []byte) error {
	type Alias Vitals
	return json.Unmarshal(b, (*Alias)(v))
}

type SOAPNote struct {
	ID         uuid.UUID `db:"id"          json:"id"`
	SessionID  uuid.UUID `db:"session_id"  json:"session_id"`
	Subjective string    `db:"subjective"  json:"subjective"`
	Objective  string    `db:"objective"   json:"objective"`
	Assessment string    `db:"assessment"  json:"assessment"`
	Plan       string    `db:"plan"        json:"plan"`
	PainScale  *int32    `db:"pain_scale"  json:"pain_scale,omitempty"` // 0-10
	Vitals     *Vitals   `db:"vitals"      json:"vitals,omitempty"`
	CreatedAt  time.Time `db:"created_at"  json:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"  json:"updated_at"`
}

func (s SOAPNote) ToModel() *model.SOAPNote {
	return &model.SOAPNote{
		ID:         s.ID,
		SessionID:  s.SessionID,
		Subjective: s.Subjective,
		Objective:  s.Objective,
		Assessment: s.Assessment,
		Plan:       s.Plan,
		PainScale:  s.PainScale,
		Vitals: &model.Vitals{
			Bp:     s.Vitals.BP,
			Hr:     s.Vitals.HR,
			Spo2:   s.Vitals.SpO2,
			Temp:   s.Vitals.Temp,
			Weight: s.Vitals.Weight,
		},
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
		Session:   &model.TreatmentSession{}, // TODO: Complete this
	}
}
