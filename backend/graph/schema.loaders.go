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
	UserLoader                              *dataloadgen.Loader[uuid.UUID, *model.User]
	StaffLoader                             *dataloadgen.Loader[uuid.UUID, *model.Staff]
	StaffByUserIDLoader                     *dataloadgen.Loader[uuid.UUID, *model.Staff]
	PatientLoader                           *dataloadgen.Loader[uuid.UUID, *model.Patient]
	TreatmentSessionLoader                  *dataloadgen.Loader[uuid.UUID, *model.TreatmentSession]
	TreatmentSessionReportBySessionIDLoader *dataloadgen.Loader[uuid.UUID, *model.TreatmentSessionReport]
	TreatmentSessionByPatientIDLoader       *dataloadgen.Loader[uuid.UUID, *model.TreatmentSession]
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(repositories repository.Repositories) *Loaders {
	// define the data loader
	userLoader := dataloadgen.NewLoader(repositories.UserRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	staffLoader := dataloadgen.NewLoader(repositories.StaffRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	staffByUserIDLoader := dataloadgen.NewLoader(repositories.StaffRepository.LoaderByUserIDs, dataloadgen.WithWait(time.Millisecond))
	patientLoader := dataloadgen.NewLoader(repositories.PatientRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionLoader := dataloadgen.NewLoader(repositories.TreatmentSessionRepository.Loader, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionReportBySessionLoader := dataloadgen.NewLoader(repositories.TreatmentSessionReportRepository.LoaderBySessionIDs, dataloadgen.WithWait(time.Millisecond))
	treatmentSessionByPatientIDLoader := dataloadgen.NewLoader(repositories.TreatmentSessionRepository.LoaderByPatientIDs, dataloadgen.WithWait(time.Millisecond))
	return &Loaders{
		UserLoader:                              userLoader,
		StaffLoader:                             staffLoader,
		StaffByUserIDLoader:                     staffByUserIDLoader,
		PatientLoader:                           patientLoader,
		TreatmentSessionLoader:                  treatmentSessionLoader,
		TreatmentSessionReportBySessionIDLoader: treatmentSessionReportBySessionLoader,
		TreatmentSessionByPatientIDLoader:       treatmentSessionByPatientIDLoader,
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

// GetPatient returns single patient by id efficiently
func GetPatient(ctx context.Context, ID uuid.UUID) (*model.Patient, error) {
	loaders := For(ctx)
	return loaders.PatientLoader.Load(ctx, ID)
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

func GetReportBySessionID(ctx context.Context, ID uuid.UUID) (*model.TreatmentSessionReport, error) {
	loaders := For(ctx)
	return loaders.TreatmentSessionReportBySessionIDLoader.Load(ctx, ID)
}
