package entity

import (
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	UserRoleAdmin        UserRole = "ADMIN"
	UserRoleTherapist    UserRole = "THERAPIST"
	UserRoleReceptionist UserRole = "RECEPTIONIST"
)

type Gender string

const (
	GenderMale   Gender = "MALE"
	GenderFemale Gender = "FEMALE"
	GenderOther  Gender = "OTHER"
)

type User struct {
	ID           uuid.UUID `db:"id"            json:"id"`
	Email        string    `db:"email"         json:"email"`
	PasswordHash string    `db:"password_hash" json:"-"` // never expose
	Role         UserRole  `db:"role"          json:"role"`
	IsActive     bool      `db:"is_active"     json:"is_active"`
	CreatedAt    time.Time `db:"created_at"    json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at"    json:"updated_at"`
}
