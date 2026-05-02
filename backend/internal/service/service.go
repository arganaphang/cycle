package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type Services struct {
	PatientService                PatientService
	StaffService                  StaffService
	TreatmentSessionService       TreatmentSessionService
	TreatmentSessionReportService TreatmentSessionReportService
	UserService                   UserService
}

func NewServices(repositories repository.Repositories) Services {
	return Services{
		PatientService:                NewPatientService(repositories),
		StaffService:                  NewStaffService(repositories),
		TreatmentSessionService:       NewTreatmentSessionService(repositories),
		TreatmentSessionReportService: NewTreatmentSessionReportService(repositories),
		UserService:                   NewUserService(repositories),
	}
}
