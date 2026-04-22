package service

import "github.com/arganaphang/cycle/backend/internal/repository"

type SoapNoteService interface{}

type soapNoteService struct {
	repositories repository.Repositories
}

func NewSoapNoteService(repositories repository.Repositories) SoapNoteService {
	return &soapNoteService{repositories: repositories}
}
