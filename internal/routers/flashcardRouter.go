package routers

import (
	"flashcards/internal/handler"

	"github.com/go-chi/chi/v5"
)

func FlashcardRouter(handler *handler.FlashcardHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.Post("/", handler.Create)
	r.Put("/", handler.UpdateFlashcards)

	r.Put("/{id}/tracking", handler.ToggleTracking)

	r.Get("/", handler.List)
	r.Get("/{id}", handler.GetByID)
	// r.Put("/{id}", handler.UpdateByID)
	r.Delete("/{id}", handler.DeleteByID)

	return r
}
