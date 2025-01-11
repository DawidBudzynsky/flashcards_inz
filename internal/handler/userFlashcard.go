package handler

import (
	"encoding/json"
	"flashcards/internal/algorithm/review"
	"flashcards/internal/middlewares"
	"flashcards/internal/service"
	"net/http"
)

type UserFlashcardHandler struct {
	Service service.UserFlashcardService
}

var (
	UserUnauthorizedError = func(w http.ResponseWriter) {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	UnableToUpdateCardError = func(w http.ResponseWriter, error string) {
		http.Error(w, "Service was unable to update the card: "+error, http.StatusUnauthorized)
		return
	}
)

func (u *UserFlashcardHandler) Create(w http.ResponseWriter, r *http.Request) {
	var reviewItem review.ReviewItem
	if err := json.NewDecoder(r.Body).Decode(&reviewItem); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get userGoogleID from context
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

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(updatedCard); err != nil {
		http.Error(w, "Failed to encode a flashcard", http.StatusInternalServerError)
	}
}
