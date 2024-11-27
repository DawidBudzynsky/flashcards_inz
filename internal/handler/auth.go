package handler

import (
	"context"
	"flashcards/internal/models"
	"flashcards/internal/service"
	"flashcards/internal/util"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/markbates/goth/gothic"
)

type AuthHandler struct {
	UserService service.UserServiceInterface
}

func (a *AuthHandler) GetAuthCallbackFunc(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	r = r.WithContext(context.WithValue(context.Background(), "provider", provider))

	gotUser, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		// TODO: change to error print
		fmt.Fprint(w, r)
		return
	}
	fmt.Println(gotUser)

	// try to get user from db
	var user *models.User
	fmt.Println(gotUser.Email)
	user, err = a.UserService.GetUserByEmail(gotUser.UserID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// if no user in db
	if user == nil {
		// create / register new user
		body := service.CreateUserRequest{
			GoogleID: gotUser.UserID,
			Username: gotUser.Name,
			Email:    gotUser.Email,
		}
		user, err = a.UserService.CreateUser(body)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}
	}

	err = util.SetUserSession(w, r, util.UserSession{
		UserID: gotUser.UserID,
		Email:  gotUser.Email,
	})
	if err != nil {
		http.Error(w, "Failed to create user session", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "http://localhost:5173", http.StatusFound)
}
