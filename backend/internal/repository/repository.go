package repository

import "github.com/jmoiron/sqlx"

type Repositories struct {
	AppointmentRepository      AppointmentRepository
	PatientRepository          PatientRepository
	SoapNoteRepository         SoapNoteRepository
	StaffRepository            StaffRepository
	TreatmentSessionRepository TreatmentSessionRepository
	UserRepository             UserRepository
}

func NewRepositories(db *sqlx.DB) Repositories {
	return Repositories{
		AppointmentRepository:      NewAppointmentRepository(db),
		PatientRepository:          NewPatientRepository(db),
		SoapNoteRepository:         NewSoapNoteRepository(db),
		StaffRepository:            NewStaffRepository(db),
		TreatmentSessionRepository: NewTreatmentSessionRepository(db),
		UserRepository:             NewUserRepository(db),
	}
}
