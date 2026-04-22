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
	UserLoader                            *dataloadgen.Loader[uuid.UUID, *model.User]
	StaffLoader                           *dataloadgen.Loader[uuid.UUID, *model.Staff]
	StaffByUserIDLoader                   *dataloadgen.Loader[uuid.UUID, *model.Staff]
	PatientLoader                         *dataloadgen.Loader[uuid.UUID, *model.Patient]
	AppointmentLoader                     *dataloadgen.Loader[uuid.UUID, *model.Appointment]
	AppointmentByPatientIDLoader          *dataloadgen.Loader[uuid.UUID, *model.Appointment]
	AppointmentByStaffIDLoader            *dataloadgen.Loader[uuid.UUID, *model.Appointment]
	TreatmentSessionLoader                *dataloadgen.Loader[uuid.UUID, *model.TreatmentSession]
	TreatmentSessionByAppointmentIDLoader *dataloadgen.Loader[uuid.UUID, *model.TreatmentSession]
	TreatmentSessionByPatientIDLoader     *dataloadgen.Loader[uuid.UUID, *model.TreatmentSession]
	SOAPNoteByTreatmentSessionIDLoader    *dataloadgen.Loader[uuid.UUID, *model.SOAPNote]
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(repositories repository.Repositories) *Loaders {
	// define the data loader
	userLoader := dataloadgen.NewLoader(repositories.UserRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	staffLoader := dataloadgen.NewLoader(repositories.StaffRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	staffByUserIDLoader := dataloadgen.NewLoader(repositories.StaffRepository.LoaderByUserIDs, dataloadgen.WithWait(time.Millisecond))
	patientLoader := dataloadgen.NewLoader(repositories.PatientRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	appointmentLoader := dataloadgen.NewLoader(repositories.AppointmentRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionLoader := dataloadgen.NewLoader(repositories.TreatmentSessionRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionByAppointmentIDLoader := dataloadgen.NewLoader(repositories.TreatmentSessionRepository.LoaderByAppointmentIDs, dataloadgen.WithWait(time.Millisecond))
	appointmentByPatientIDLoader := dataloadgen.NewLoader(repositories.AppointmentRepository.LoaderByPatientIDs, dataloadgen.WithWait(time.Millisecond))
	appointmentByStaffIDLoader := dataloadgen.NewLoader(repositories.AppointmentRepository.LoaderByStaffIDs, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionByPatientIDLoader := dataloadgen.NewLoader(repositories.TreatmentSessionRepository.LoaderByPatientIDs, dataloadgen.WithWait(time.Millisecond))
	sOAPNoteByTreatmentSessionIDLoader := dataloadgen.NewLoader(repositories.SoapNoteRepository.LoaderByTreatmentSessionIDs, dataloadgen.WithWait(time.Millisecond))
	return &Loaders{
		UserLoader:                            userLoader,
		StaffLoader:                           staffLoader,
		StaffByUserIDLoader:                   staffByUserIDLoader,
		PatientLoader:                         patientLoader,
		AppointmentLoader:                     appointmentLoader,
		TreatmentSessionLoader:                treatmentSessionLoader,
		TreatmentSessionByAppointmentIDLoader: treatmentSessionByAppointmentIDLoader,
		AppointmentByPatientIDLoader:          appointmentByPatientIDLoader,
		AppointmentByStaffIDLoader:            appointmentByStaffIDLoader,
		TreatmentSessionByPatientIDLoader:     treatmentSessionByPatientIDLoader,
		SOAPNoteByTreatmentSessionIDLoader:    sOAPNoteByTreatmentSessionIDLoader,
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

// GetUser returns single user by id efficiently
func GetUser(ctx context.Context, ID uuid.UUID) (*model.User, error) {
	loaders := For(ctx)
	return loaders.UserLoader.Load(ctx, ID)
}

// GetStaffByUserID returns single staff by id efficiently
func GetStaffByUserID(ctx context.Context, ID uuid.UUID) (*model.Staff, error) {
	loaders := For(ctx)
	return loaders.StaffByUserIDLoader.Load(ctx, ID)
}

// GetStaff returns single staff by id efficiently
func GetStaff(ctx context.Context, ID uuid.UUID) (*model.Staff, error) {
	loaders := For(ctx)
	return loaders.StaffLoader.Load(ctx, ID)
}

// GetAppointment returns single appointment by id efficiently
func GetAppointment(ctx context.Context, ID uuid.UUID) (*model.Appointment, error) {
	loaders := For(ctx)
	return loaders.AppointmentLoader.Load(ctx, ID)
}

// GetAppointmentByPatientID returns single appointment by id efficiently
func GetAppointmentByPatientID(ctx context.Context, ID uuid.UUID) ([]*model.Appointment, error) {
	loaders := For(ctx)
	return loaders.AppointmentByPatientIDLoader.LoadAll(ctx, []uuid.UUID{ID})
}

// GetAppointmentByStaffID returns single appointment by id efficiently
func GetAppointmentByStaffID(ctx context.Context, ID uuid.UUID) ([]*model.Appointment, error) {
	loaders := For(ctx)
	return loaders.AppointmentByStaffIDLoader.LoadAll(ctx, []uuid.UUID{ID})
}

// GetPatient returns single appointment by id efficiently
func GetPatient(ctx context.Context, ID uuid.UUID) (*model.Patient, error) {
	loaders := For(ctx)
	return loaders.PatientLoader.Load(ctx, ID)
}

// GetTreatmentSessionByAppointmentID returns single treatment session by id efficiently
func GetTreatmentSessionByAppointmentID(ctx context.Context, ID uuid.UUID) (*model.TreatmentSession, error) {
	loaders := For(ctx)
	return loaders.TreatmentSessionByAppointmentIDLoader.Load(ctx, ID)
}

// GetTreatmentSessionByPatientID returns single treatment session by id efficiently
func GetTreatmentSessionByPatientID(ctx context.Context, ID uuid.UUID) ([]*model.TreatmentSession, error) {
	loaders := For(ctx)
	return loaders.TreatmentSessionByPatientIDLoader.LoadAll(ctx, []uuid.UUID{ID})
}

// GetTreatmentSession returns single treatment session by id efficiently
func GetTreatmentSession(ctx context.Context, ID uuid.UUID) (*model.TreatmentSession, error) {
	loaders := For(ctx)
	return loaders.TreatmentSessionLoader.Load(ctx, ID)
}

// GetSOAPNoteByTreatmentSessionID returns single treatment session by id efficiently
func GetSOAPNoteByTreatmentSessionID(ctx context.Context, ID uuid.UUID) (*model.SOAPNote, error) {
	loaders := For(ctx)
	return loaders.SOAPNoteByTreatmentSessionIDLoader.Load(ctx, ID)
}
