package server

import (
	"encoding/json"
	"flashcards/internal/handler"
	"flashcards/internal/service"
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
	r.Route("/flashcards", s.loadFlashcardRoutes)
	r.Route("/folders", s.loadFolderRoutes)
	r.Route("/tests", s.loadTestRoutes)

	return r
}

func (s *Server) loadUserRoutes(router chi.Router) {
	userHandler := &handler.UserHandler{
		Service: service.NewUserSerivce(s.db.GetDB()),
	}
	router.Post("/", userHandler.Create)
	router.Get("/", userHandler.List)
	router.Get("/{id}", userHandler.GetByID)
	router.Put("/{id}", userHandler.UpdateByID)
	router.Delete("/{id}", userHandler.DeleteByID)
}

func (s *Server) loadFlashcardSetRoutes(router chi.Router) {
	flashcardSetHandler := &handler.FlashcardSetHandler{
		Service: service.NewFlashcardSetService(s.db.GetDB()),
	}
	router.Post("/", flashcardSetHandler.Create)
	router.Get("/", flashcardSetHandler.List)
	router.Get("/{id}", flashcardSetHandler.GetByID)
	router.Put("/{id}", flashcardSetHandler.UpdateByID)
	router.Delete("/{id}", flashcardSetHandler.DeleteByID)
}

func (s *Server) loadFlashcardRoutes(router chi.Router) {
	flashcardHandler := &handler.FlashcardHandler{
		Service: service.NewFlashcardService(s.db.GetDB()),
	}
	router.Post("/", flashcardHandler.Create)
	router.Get("/", flashcardHandler.List)
	router.Get("/{id}", flashcardHandler.GetByID)
	router.Put("/{id}", flashcardHandler.UpdateByID)
	router.Delete("/{id}", flashcardHandler.DeleteByID)
}

func (s *Server) loadFolderRoutes(router chi.Router) {
	folderHandler := &handler.FolderHandler{
		Service: service.NewFolderService(s.db.GetDB()),
	}
	router.Post("/", folderHandler.Create)
	router.Get("/", folderHandler.List)
	router.Get("/{id}", folderHandler.GetByID)
	router.Put("/{id}", folderHandler.UpdateByID)
	router.Delete("/{id}", folderHandler.DeleteByID)
}

func (s *Server) loadTestRoutes(router chi.Router) {
	testHandler := &handler.TestHandler{
		Service: service.NewTestService(s.db.GetDB()),
	}
	router.Post("/", testHandler.Create)
	router.Get("/", testHandler.List)
	router.Get("/{id}", testHandler.GetByID)
	router.Put("/{id}", testHandler.UpdateByID)
	router.Delete("/{id}", testHandler.DeleteByID)
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
