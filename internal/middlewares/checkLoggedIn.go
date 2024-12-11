package middlewares

import (
	"context"
	"flashcards/internal/util"
	"net/http"
)

// middleware
func CheckLoggedInMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := util.GetUserSessionFromStore(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type ContextKey string

const UserIDKey ContextKey = "user_id"

// middleware
func UserIdFromSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userId, err := util.GetUserIDFromSession(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
