package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func FlashcardRouter(handler *handler.FlashcardHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.With(middlewares.UserIdFromSession).Post("/", handler.Create)

	r.Put("/", handler.UpdateFlashcards)

	r.With(middlewares.UserIdFromSession).Put("/{id}/tracking", handler.ToggleTracking)
	r.Post("/translate", handler.Translate)

	r.Get("/", handler.List)
	r.Get("/{id}", handler.GetByID)
	// r.Put("/{id}", handler.UpdateByID)
	r.Delete("/{id}", handler.DeleteByID)

	return r
}
