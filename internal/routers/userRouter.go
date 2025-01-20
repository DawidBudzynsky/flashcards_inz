package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func UserRouter(userHandler *handler.UserHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.Post("/", userHandler.Create)
	r.Get("/", userHandler.List)
	r.With(middlewares.CheckLoggedInMiddleware).Get("/", userHandler.List)
	r.With(middlewares.UserIdFromSession).Get("/me", userHandler.GetByGoogleID)
	r.With(middlewares.UserIdFromSession).Put("/toggle_visibility", userHandler.ToggleVisibility)

	r.Get("/{id}", userHandler.GetByID)
	r.Put("/{id}", userHandler.UpdateByID)
	r.Delete("/{id}", userHandler.DeleteByID)

	return r
}
