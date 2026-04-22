package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	db, err := sqlx.Connect("postgres", fmt.Sprintf(
		"user=%s dbname=%s password=%s sslmode=disable",
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_NAME"),
		os.Getenv("DATABASE_PASS"),
	))
	if err != nil {
		zap.L().Fatal("failed to connect to database", zap.Error(err))
	}

	repositories := repository.NewRepositories(db)
	services := service.NewServices(repositories)

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		Services: services,
	}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	srvWithHttp := graph.HttpMiddleware(srv)
	srvWithAuth := graph.AuthMiddleware(repositories)(srvWithHttp)

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srvWithAuth)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
