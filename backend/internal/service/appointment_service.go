package service

import (
	"github.com/arganaphang/cycle/backend/internal/repository"
)

type AppointmentService interface{}

type appointmentService struct {
	repositories repository.Repositories
}

func NewAppointmentService(repositories repository.Repositories) AppointmentService {
	return &appointmentService{repositories: repositories}
}
