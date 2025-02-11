package handler

import (
	"encoding/json"
	"flashcards/internal/middlewares"
	"flashcards/internal/repositories"
	"flashcards/internal/service"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type UserHandler struct {
	Service *service.UserService
}

func (u *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body repositories.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := u.Service.CreateUser(body)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode user", http.StatusInternalServerError)
	}
}

func (u *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	users, err := u.Service.ListUsers()
	if err != nil {
		http.Error(w, "Failed to list users", http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}

func (u *UserHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")

	user, err := u.Service.GetUserByGoogleIDPrivate(idParam)
	if err != nil {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	if user.IsPrivate {
		http.Error(w, "Failed to update user", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}

func (u *UserHandler) GetByGoogleID(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	user, err := u.Service.GetUserByGoogleID(userGoogleID)
	if err != nil {
		http.Error(w, "Failed to get user by google id from database", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}

func (u *UserHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := u.Service.UpdateUserByID(userID, updateData)
	if err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode user", http.StatusInternalServerError)
	}
}

func (u *UserHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	if err := u.Service.DeleteUserByGoogleID(userGoogleID); err != nil {
		http.Error(w, "Failed to encode user", http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusNoContent)
}

func (u *UserHandler) ToggleVisibility(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	user, err := u.Service.ToggleVisibility(userGoogleID)
	if err != nil {
		http.Error(w, "Failed to get user by google id from database", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}
