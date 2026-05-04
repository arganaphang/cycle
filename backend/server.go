package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/arganaphang/cycle/backend/graph"
	"github.com/arganaphang/cycle/backend/internal/repository"
	"github.com/arganaphang/cycle/backend/internal/service"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
	"go.uber.org/zap"
)

const defaultPort = "8000"

func init() {
	zap.ReplaceGlobals(zap.Must(zap.NewProduction()))
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	dsn := fmt.Sprintf(
		"user=%s dbname=%s password=%s sslmode=disable",
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_NAME"),
		os.Getenv("DATABASE_PASS"),
	)
	if h := strings.TrimSpace(os.Getenv("DATABASE_HOST")); h != "" {
		dsn = fmt.Sprintf("host=%s %s", h, dsn)
	}
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		zap.L().Fatal("failed to connect to database", zap.Error(err))
	}

	repositories := repository.NewRepositories(db)
	services := service.NewServices(repositories)

	conf := graph.Config{Resolvers: &graph.Resolver{Services: services}}
	conf.Directives.Public = graph.PublicDirective
	sch := graph.NewExecutableSchema(conf)
	srv := handler.New(sch)
	srv.AroundRootFields(graph.RequireAuthRootMiddleware(sch))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	srvWithLoader := graph.LoaderMiddleware(repositories, srv)
	srvWithHttp := graph.HttpMiddleware(srvWithLoader)
	srvWithAuth := graph.AuthMiddleware(repositories)(srvWithHttp)

	mux := http.NewServeMux()
	mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	mux.Handle("/query", srvWithAuth)

	h := cors.New(cors.Options{
		AllowedOrigins:   corsAllowedOrigins(),
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
	}).Handler(mux)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, h))
}

// corsAllowedOrigins lists frontend origins allowed to call this API with credentials.
// Set CORS_ORIGINS to a comma-separated list (e.g. http://localhost:5173,http://localhost:3000).
func corsAllowedOrigins() []string {
	if v := strings.TrimSpace(os.Getenv("CORS_ORIGINS")); v != "" {
		parts := strings.Split(v, ",")
		out := make([]string, 0, len(parts))
		for _, p := range parts {
			if t := strings.TrimSpace(p); t != "" {
				out = append(out, t)
			}
		}
		if len(out) > 0 {
			return out
		}
	}
	return []string{
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	}
}
