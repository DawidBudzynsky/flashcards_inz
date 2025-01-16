package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func TestRouter(handler *handler.TestHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.With(middlewares.UserIdFromSession).Post("/", handler.Create)
	r.With(middlewares.UserIdFromSession).Get("/{id}/questions", handler.CreateQuestions)
	r.With(middlewares.UserIdFromSession).Post("/verify", handler.VerifyAnswers)
	r.Get("/", handler.List)
	r.Get("/{id}", handler.GetByID)
	r.Put("/{id}", handler.UpdateByID)
	r.Delete("/{id}", handler.DeleteByID)

	return r
}
