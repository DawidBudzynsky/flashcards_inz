package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func SessionRouter(handler *handler.NotificationManager) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.Use(middlewares.UserIdFromSession)
	r.Get("/{testID}", handler.SseHandler)

	return r
}
