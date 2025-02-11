package handler

import (
	"encoding/json"
	"flashcards/internal/middlewares"
	"flashcards/internal/models"
	"flashcards/internal/repositories"
	"flashcards/internal/service"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type FlashcardHandler struct {
	Service *service.FlashcardService
}

func (h *FlashcardHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body []repositories.CreateFlashcardRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	for _, flashcard := range body {
		flashcard.UserGoogleID = userGoogleID
		_, err := h.Service.CreateFlashcard(flashcard)
		if err != nil {
			http.Error(w, "Failed to create flashcard", http.StatusInternalServerError)
			return
		}

	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(map[string]string{"message": "created flashcards"}); err != nil {
		http.Error(w, "Failed to encode flashcard", http.StatusInternalServerError)
	}
}

func (h *FlashcardHandler) List(w http.ResponseWriter, r *http.Request) {
	var flashcards []models.Flashcard
	flashcards, err := h.Service.ListFlashcards()
	if err != nil {
		http.Error(w, "Failed to retrieve flashcards", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcards); err != nil {
		http.Error(w, "Failed to encode flashcards", http.StatusInternalServerError)
	}
}

func (h *FlashcardHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	flashcard, err := h.Service.GetFlashcardByID(flashcardID)
	if err != nil {
		http.Error(w, "Flashcard not found", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcard); err != nil {
		http.Error(w, "Failed to encode flashcard", http.StatusInternalServerError)
	}
}

func (h *FlashcardHandler) UpdateFlashcards(w http.ResponseWriter, r *http.Request) {
	var body []repositories.UpdateFlashcardRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, flashcard := range body {

		_, err := h.Service.UpdateFlashcardByID(flashcard.ID, flashcard)
		if err != nil {
			http.Error(w, "Failed to update flashcard", http.StatusInternalServerError)
			return
		}

	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(map[string]string{"message": "created flashcards"}); err != nil {
		http.Error(w, "Failed to encode flashcard", http.StatusInternalServerError)
	}
}

func (h *FlashcardHandler) ToggleTracking(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	flashcardIDStr := chi.URLParam(r, "id")
	flashcardID, err := strconv.ParseUint(flashcardIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid flashcard ID", http.StatusBadRequest)
		return
	}

	if err := h.Service.ToggleTracking(flashcardID); err != nil {
		http.Error(w, "Unable to Toggle flashcard tracking", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(map[string]string{"message": "created flashcards"}); err != nil {
		http.Error(w, "Failed to encode flashcard", http.StatusInternalServerError)
	}
}

func (h *FlashcardHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardID, err := strconv.Atoi(idParam)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := h.Service.DeleteFlashcardByID(flashcardID); err != nil {
		http.Error(w, "Failed to delete flashcard", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *FlashcardHandler) Translate(w http.ResponseWriter, r *http.Request) {
	var req service.TranslateRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	translateResp, err := h.Service.TranslateText(&req)
	if err != nil {
		http.Error(w, "Failed to parse translation response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(translateResp.Data.Translations[0].TranslatedText); err != nil {
		http.Error(w, "Failed to encode translation response", http.StatusInternalServerError)
	}
}
