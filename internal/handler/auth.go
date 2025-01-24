package handler

import (
	"context"
	"encoding/json"
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
		fmt.Fprint(w, r)
		return
	}
	fmt.Println(gotUser)

	// try to get user from db
	var user *models.User
	user, err = a.UserService.GetUserByEmail(gotUser.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Println(user)

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

func (a *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	util.RemoveCookieSession(w, r)
}

func (a *AuthHandler) CheckIfUserLoggedIn(w http.ResponseWriter, r *http.Request) {
	_, err := util.GetUserSessionFromStore(r)
	if err != nil {
		// User is not logged in
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"message": "User is not logged in",
		})
		return
	}
	// User is logged in
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "User is logged in",
	})
}

func (a *AuthHandler) AuthHandler(w http.ResponseWriter, r *http.Request) {
	if _, err := gothic.CompleteUserAuth(w, r); err == nil {
	} else {
		gothic.BeginAuthHandler(w, r)
	}
}

func (a *AuthHandler) GetUserDatabaseId(w http.ResponseWriter, r *http.Request) {
	userID, err := util.GetUserIDFromSession(r)
	if err != nil {
		http.Error(w, "Invalid session or user not found", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(userID)
	if err != nil {
		http.Error(w, "Failed to encode user data", http.StatusInternalServerError)
		return
	}
}
