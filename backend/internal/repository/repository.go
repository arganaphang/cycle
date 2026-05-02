package repository

import "github.com/jmoiron/sqlx"

type Repositories struct {
	PatientRepository                PatientRepository
	StaffRepository                  StaffRepository
	TreatmentSessionRepository       TreatmentSessionRepository
	TreatmentSessionReportRepository TreatmentSessionReportRepository
	UserRepository                   UserRepository
}

func NewRepositories(db *sqlx.DB) Repositories {
	return Repositories{
		PatientRepository:                NewPatientRepository(db),
		StaffRepository:                  NewStaffRepository(db),
		TreatmentSessionRepository:       NewTreatmentSessionRepository(db),
		TreatmentSessionReportRepository: NewTreatmentSessionReportRepository(db),
		UserRepository:                   NewUserRepository(db),
	}
}
