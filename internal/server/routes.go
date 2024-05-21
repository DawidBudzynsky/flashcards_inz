package server

import (
	"encoding/json"
	"flashcards/internal/handler"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", s.HelloWorldHandler)
	r.Get("/health", s.healthHandler)
	r.Route("/users", s.loadUserRoutes)
	r.Route("/flashcards_sets", s.loadFlashcardSetRoutes)

	return r
}

func (s *Server) loadUserRoutes(router chi.Router) {
	userHandler := &handler.User{
		DB: s.db.GetDB(),
	}
	router.Post("/", userHandler.Create)
	router.Get("/", userHandler.List)
	router.Get("/{id}", userHandler.GetByID)
	router.Put("/{id}", userHandler.UpdateByID)
	router.Delete("/{id}", userHandler.DeleteByID)
}

func (s *Server) loadFlashcardSetRoutes(router chi.Router) {
	flashcardSetHandler := &handler.FlashcardSetHandler{
		DB: s.db.GetDB(),
	}
	router.Post("/", flashcardSetHandler.Create)
	router.Get("/", flashcardSetHandler.List)
	router.Get("/{id}", flashcardSetHandler.GetByID)
	router.Put("/{id}", flashcardSetHandler.UpdateByID)
	router.Delete("/{id}", flashcardSetHandler.DeleteByID)
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}
	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}
