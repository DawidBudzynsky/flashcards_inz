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
	r.Use(middlewares.UserIdFromSession)

	r.Post("/", handler.Create)
	r.Get("/{id}/questions", handler.CreateQuestions)
	r.Get("/{id}/results", handler.GetUserResults)
	r.Post("/verify", handler.VerifyAnswers)
	r.Get("/grouped", handler.GetTestsForUser)
	r.Get("/testToken", handler.AccessTest)

	r.Get("/{id}", handler.GetByID)
	r.Put("/{id}", handler.UpdateByID)
	r.Delete("/{id}", handler.DeleteByID)

	return r
}
