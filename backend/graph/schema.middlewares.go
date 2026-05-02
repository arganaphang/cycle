package graph

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/arganaphang/cycle/backend/pkg/jewete"
	"github.com/vektah/gqlparser/v2/ast"
	"github.com/vektah/gqlparser/v2/gqlerror"
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

// RequireAuthRootMiddleware requires an authenticated user for each root Query/Mutation field
// unless the schema field has @public or is a GraphQL introspection field (__schema, etc.).
func RequireAuthRootMiddleware(es graphql.ExecutableSchema) graphql.RootFieldMiddleware {
	s := es.Schema()
	return func(ctx context.Context, next graphql.RootResolver) graphql.Marshaler {
		fc := graphql.GetFieldContext(ctx)
		rfc := graphql.GetRootFieldContext(ctx)
		if fc == nil || rfc == nil {
			return next(ctx)
		}

		parent := fc.Object
		name := rfc.Field.Name

		if rootFieldAllowsAnonymous(s, parent, name) {
			return next(ctx)
		}
		if ForAuthContext(ctx) != nil {
			return next(ctx)
		}

		graphql.AddError(ctx, gqlerror.Errorf("authentication required"))
		return graphql.Null
	}
}

// PublicDirective implements gqlgen's @public hook for fields that include that directive.
// Access control for root operations is enforced in RequireAuthRootMiddleware.
func PublicDirective(ctx context.Context, obj any, next graphql.Resolver) (any, error) {
	return next(ctx)
}

func rootFieldAllowsAnonymous(schema *ast.Schema, parentTypeName, fieldName string) bool {
	if strings.HasPrefix(fieldName, "__") {
		return true
	}
	def := schema.Types[parentTypeName]
	if def == nil || def.Kind != ast.Object {
		return false
	}
	for _, f := range def.Fields {
		if f.Name == fieldName {
			return f.Directives.ForName("public") != nil
		}
	}
	return false
}
