package routers

import (
	"flashcards/internal/handler"
	"flashcards/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func AuthRouter(handler *handler.AuthHandler) chi.Router {
	r := chi.NewRouter()

	//middlewares
	//...

	r.Get("/auth/callback", handler.GetAuthCallbackFunc)
	r.Get("/auth", handler.AuthHandler)
	r.Get("/logout", handler.Logout)
	r.Get("/check-user-logged-in", handler.CheckIfUserLoggedIn)
	r.With(middlewares.CheckLoggedInMiddleware).Get("/auth/me", handler.GetUserDatabaseId)

	return r
}
