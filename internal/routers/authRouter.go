package routers

import (
	"flashcards/internal/handler"

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

	return r
}
