package entity

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Vitals struct {
	BP     *string  `json:"bp,omitempty"`     // e.g. "120/80"
	HR     *int     `json:"hr,omitempty"`     // beats per minute
	SpO2   *int     `json:"spo2,omitempty"`   // percentage
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
	PainScale  *int      `db:"pain_scale"  json:"pain_scale,omitempty"` // 0-10
	Vitals     *Vitals   `db:"vitals"      json:"vitals,omitempty"`
	CreatedAt  time.Time `db:"created_at"  json:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"  json:"updated_at"`
}
