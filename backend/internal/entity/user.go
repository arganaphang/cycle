package entity

import (
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/google/uuid"
)

const TABLE_USER = "users"

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

func (u User) ToModel() *model.User {
	return &model.User{
		ID:        u.ID,
		Email:     u.Email,
		Role:      model.UserRole(u.Role),
		IsActive:  u.IsActive,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
