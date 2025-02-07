package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func TrackingRouter(trackingHandler *handler.TrackingHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.With(middlewares.UserIdFromSession).Put("/reviews", trackingHandler.Create)
	r.With(middlewares.UserIdFromSession).Get("/flashcards_today", trackingHandler.GetFlashcardsForToday)

	return r
}
