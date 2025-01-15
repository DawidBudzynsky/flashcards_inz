package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func FlashcardSetRouter(handler *handler.FlashcardSetHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.With(middlewares.UserIdFromSession).Post("/", handler.Create)
	r.Get("/", handler.List)
	r.Get("/{id}", handler.GetByID)
	r.Put("/{id}", handler.UpdateByID)
	r.Post("/add_set_to_folder", handler.AddSetToFolder)
	r.Post("/remove_set_from_folder", handler.RemoveSetFromFolder)
	r.Delete("/{id}", handler.DeleteByID)
	return r
}
