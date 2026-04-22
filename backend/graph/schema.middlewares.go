package graph

import (
	"context"
	"net/http"
	"os"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/arganaphang/cycle/backend/pkg/jewete"
)

type contextKey struct {
	name string
}

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses

var authCtxKey = &contextKey{"auth"}

func AuthMiddleware(repositories repository.Repositories) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("auth_token")

			// Allow unauthenticated users in
			if err != nil || cookie == nil {
				next.ServeHTTP(w, r)
				return
			}

			user, err := jewete.VerifyToken[*model.User]([]byte(os.Getenv("SECRET_KEY")), cookie.Value)
			if err != nil {
				http.Error(w, "Invalid cookie", http.StatusForbidden)
				return
			}

			// get the user from the database
			userExist, err := repositories.UserRepository.FindByID(r.Context(), user.ID)
			if err != nil {
				http.Error(w, "Failed to get user", http.StatusForbidden)
				return
			}

			// put it in context
			ctx := context.WithValue(r.Context(), authCtxKey, userExist.ToModel())

			// and call the next with our new context
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// ForAuthContext finds the user from the context. REQUIRES Middleware to have run.
func ForAuthContext(ctx context.Context) *model.User {
	raw, _ := ctx.Value(authCtxKey).(*model.User)
	return raw
}

var httpCtxKey = &contextKey{"http"}

func HttpMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// put it in context
		ctx := context.WithValue(r.Context(), httpCtxKey, w)

		// and call the next with our new context
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

// ForHttpContext finds the user from the context. REQUIRES Middleware to have run.
func ForHttpContext(ctx context.Context) http.ResponseWriter {
	raw, _ := ctx.Value(httpCtxKey).(http.ResponseWriter)
	return raw
}
