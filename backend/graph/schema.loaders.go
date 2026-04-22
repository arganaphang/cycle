package graph

import (
	"context"
	"net/http"
	"time"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/vikstrous/dataloadgen"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	UserLoader             *dataloadgen.Loader[uuid.UUID, *model.User]
	StaffLoader            *dataloadgen.Loader[uuid.UUID, *model.Staff]
	AppointmentLoader      *dataloadgen.Loader[uuid.UUID, *model.Appointment]
	TreatmentSessionLoader *dataloadgen.Loader[uuid.UUID, *model.TreatmentSession]
	SOAPNoteLoader         *dataloadgen.Loader[uuid.UUID, *model.SOAPNote]
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(repositories repository.Repositories) *Loaders {
	// define the data loader
	userLoader := dataloadgen.NewLoader(repositories.UserRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	staffLoader := dataloadgen.NewLoader(repositories.StaffRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	appointmentLoader := dataloadgen.NewLoader(repositories.AppointmentRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionLoader := dataloadgen.NewLoader(repositories.TreatmentSessionRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	soapNoteLoader := dataloadgen.NewLoader(repositories.SoapNoteRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	return &Loaders{
		UserLoader:             userLoader,
		StaffLoader:            staffLoader,
		AppointmentLoader:      appointmentLoader,
		TreatmentSessionLoader: treatmentSessionLoader,
		SOAPNoteLoader:         soapNoteLoader,
	}
}
func LoaderMiddleware(repositories repository.Repositories, next http.Handler) http.Handler {
	// return a middleware that injects the loader to the request context
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		loader := NewLoaders(repositories)
		r = r.WithContext(context.WithValue(r.Context(), loadersKey, loader))
		next.ServeHTTP(w, r)
	})
}

// For returns the dataloader for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}
