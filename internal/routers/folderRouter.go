package routers

import (
	"flashcards/internal/handler"

	"github.com/go-chi/chi/v5"
)

func FolderRouter(handler *handler.FolderHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.Post("/", handler.Create)
	r.Get("/", handler.List)
	r.Get("/{id}", handler.GetByID)
	r.Put("/{id}", handler.UpdateByID)
	r.Delete("/{id}", handler.DeleteByID)

	return r
}
