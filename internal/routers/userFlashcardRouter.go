package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func UserFlashcardRouter(userFlashcardHandler *handler.UserFlashcardHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.With(middlewares.UserIdFromSession).Put("/reviews", userFlashcardHandler.Create)
	// r.Put("/reviews", userFlashcardHandler.Create)
	// r.Get("/", userHandler.List)
	// r.With(middlewares.CheckLoggedInMiddleware).Get("/", userHandler.List)
	// r.With(middlewares.UserIdFromSession).Get("/me", userHandler.GetByGoogleID)
	// r.Get("/{id}", userHandler.GetByID)
	// r.Put("/{id}", userHandler.UpdateByID)
	// r.Delete("/{id}", userHandler.DeleteByID)

	return r
}
