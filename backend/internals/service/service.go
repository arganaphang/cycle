package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type Services struct {
	AppointmentService      AppointmentService
	PatientService          PatientService
	SoapNoteService         SoapNoteService
	StaffService            StaffService
	TreatmentSessionService TreatmentSessionService
	UserService             UserService
}

func NewServices(repositories repository.Repositories) Services {
	return Services{
		AppointmentService:      NewAppointmentService(repositories),
		PatientService:          NewPatientService(repositories),
		SoapNoteService:         NewSoapNoteService(repositories),
		StaffService:            NewStaffService(repositories),
		TreatmentSessionService: NewTreatmentSessionService(repositories),
		UserService:             NewUserService(repositories),
	}
}
