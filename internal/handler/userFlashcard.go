package handler

import (
	"encoding/json"
	"flashcards/internal/algorithm/review"
	"flashcards/internal/middlewares"
	"flashcards/internal/service"
	"net/http"
)

type TrackingHandler struct {
	Service *service.TrackingService
}

var (
	UserUnauthorizedError = func(w http.ResponseWriter) {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
	}

	UnableToUpdateCardError = func(w http.ResponseWriter, error string) {
		http.Error(w, "Service was unable to update the card: "+error, http.StatusUnauthorized)
	}
)

func (u *TrackingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var reviewItem review.ReviewItem
	if err := json.NewDecoder(r.Body).Decode(&reviewItem); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		UserUnauthorizedError(w)
		return
	}

	updatedCard, err := u.Service.UpdateOrCreateFlashcard(reviewItem, userGoogleID)
	if err != nil {
		UnableToUpdateCardError(w, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(updatedCard); err != nil {
		http.Error(w, "Failed to encode a flashcard", http.StatusInternalServerError)
	}
}

func (u *TrackingHandler) GetFlashcardsForToday(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		UserUnauthorizedError(w)
		return
	}

	todayFlashcards, err := u.Service.GetFlashcardsForToday(userGoogleID)
	if err != nil {
		http.Error(w, "Failed to retreive flashcards for today", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(todayFlashcards); err != nil {
		http.Error(w, "Failed to encode a flashcard", http.StatusInternalServerError)
	}
}
