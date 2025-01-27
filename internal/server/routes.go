package server

import (
	"encoding/json"
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"
	"flashcards/internal/repositories"
	"flashcards/internal/routers"
	"flashcards/internal/service"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum age for preflight requests
	})

	// middlewares global
	r.Use(middlewares.LoggingMiddleware)
	r.Use(middleware.Logger)
	r.Use(cors.Handler)

	// Public routes
	r.Group(func(r chi.Router) {
		r.Get("/", s.HelloWorldHandler)
		r.Get("/health", s.healthHandler)
	})

	userRepo := repositories.NewUserRepo(s.db.GetDB())
	userHandler := &handler.UserHandler{Service: service.NewUserSerivce(userRepo)}
	r.Mount("/users", routers.UserRouter(userHandler))

	userFlashcardRepo := repositories.NewUserFlashcardRepo(s.db.GetDB())
	userFlashcardHandler := &handler.UserFlashcardHandler{Service: service.NewUserFlashcardService(userFlashcardRepo)}
	r.Mount("/user_flashcards", routers.UserFlashcardRouter(userFlashcardHandler))

	flashcardRepo := repositories.NewFlashcardRepo(s.db.GetDB())
	flashcardHandler := &handler.FlashcardHandler{Service: service.NewFlashcardService(flashcardRepo)}
	r.Mount("/flashcards", routers.FlashcardRouter(flashcardHandler))

	flashcardSetRepo := repositories.NewFlashcardSetRepo(s.db.GetDB())
	flashcardSetHandler := &handler.FlashcardSetHandler{Service: service.NewFlashcardSetService(flashcardSetRepo, service.NewFlashcardService(flashcardRepo))}
	r.Mount("/flashcards_sets", routers.FlashcardSetRouter(flashcardSetHandler))

	folderRepo := repositories.NewFolderRepo(s.db.GetDB())
	folderHandler := &handler.FolderHandler{Service: service.NewFolderService(folderRepo)}
	r.Mount("/folders", routers.FolderRouter(folderHandler))

	testHandler := &handler.TestHandler{Service: service.NewTestService(s.db.GetDB())}
	r.Mount("/tests", routers.TestRouter(testHandler))

	authHandler := &handler.AuthHandler{UserService: *service.NewUserSerivce(userRepo)}
	r.Mount("/", routers.AuthRouter(authHandler))

	manager := handler.NewConnectionManager()
	r.Mount("/sse", routers.SessionRouter(manager))

	return r
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
