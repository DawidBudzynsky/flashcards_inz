package server

import (
	"encoding/json"
	"flashcards/internal/handler"
	"flashcards/internal/service"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/markbates/goth/gothic"
	"github.com/rs/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()

	// middlewares
	r.Use(middleware.Logger)

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum age for preflight requests
	})
	// Apply CORS middleware
	r.Use(cors.Handler)

	// Public routes
	r.Group(func(r chi.Router) {
		r.Get("/", s.HelloWorldHandler)
		r.Get("/health", s.healthHandler)
	})

	// auth routes
	// r.Group(func(r chi.Router) {
	// 	r.Get("/auth/callback", s.getAuthCallbackFunction)
	// 	r.Get("/logout", s.logout)
	// 	r.Get("/auth", s.authHandler)
	// })

	// auth roues
	s.loadAuthRoutes(r)
	r.Route("/users", s.loadUserRoutes)
	r.Route("/flashcards_sets", s.loadFlashcardSetRoutes)
	r.Route("/flashcards", s.loadFlashcardRoutes)
	r.Route("/folders", s.loadFolderRoutes)
	r.Route("/tests", s.loadTestRoutes)

	return r
}

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// TODO: for now its only this one
func AuthCheckHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(Response{
		Success: true,
		Message: "User is logged in",
	})
}

func (s *Server) loadAuthRoutes(router chi.Router) {
	authHandler := &handler.AuthHandler{
		UserService: service.NewUserSerivce(s.db.GetDB()),
	}
	router.Get("/auth/callback", authHandler.GetAuthCallbackFunc)
	router.Get("/auth", s.authHandler)
	router.Get("/logout", authHandler.Logout)
	// TODO: not sure if this
	router.Get("/check-user-logged-in", authHandler.CheckIfUserLoggedIn)
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

func (s *Server) authHandler(w http.ResponseWriter, r *http.Request) {
	if _, err := gothic.CompleteUserAuth(w, r); err == nil {
	} else {
		gothic.BeginAuthHandler(w, r)
	}
}

func (s *Server) logout(w http.ResponseWriter, r *http.Request) {
	gothic.Logout(w, r)
	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusTemporaryRedirect)
}
