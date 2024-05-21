package handler

import (
	"encoding/json"
	"flashcards/internal/models"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type FlashcardSetHandler struct {
	DB *gorm.DB
}

func (h *FlashcardSetHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body struct {
		UserID      int    `json:"user_id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		FolderID    int    `json:"folder_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	flashcardSet := models.FlashcardSet{
		UserID:      body.UserID,
		Title:       body.Title,
		Description: body.Description,
		CreatedAt:   time.Now(),
		FolderID:    body.FolderID,
	}

	if result := h.DB.Create(&flashcardSet); result.Error != nil {
		http.Error(w, "Failed to create flashcard set", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcard set", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) List(w http.ResponseWriter, r *http.Request) {
	var flashcardSets []models.FlashcardSet
	if result := h.DB.Find(&flashcardSets); result.Error != nil {
		http.Error(w, "Failed to retrieve flashcard sets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSets); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	setID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var flashcardSet models.FlashcardSet
	if result := h.DB.First(&flashcardSet, setID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "FlashcardSet not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to retrieve flashcard set", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcard", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardSetID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var updatedFlashcardSet models.FlashcardSet
	if err := json.NewDecoder(r.Body).Decode(&updatedFlashcardSet); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var flashcardSet models.FlashcardSet
	if result := h.DB.First(&flashcardSet, flashcardSetID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Flashcard set not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to retrieve flashcard set", http.StatusInternalServerError)
		}
		return
	}

	flashcardSet.UserID = updatedFlashcardSet.UserID
	flashcardSet.Title = updatedFlashcardSet.Title
	flashcardSet.Description = updatedFlashcardSet.Description
	flashcardSet.Description = updatedFlashcardSet.Description
	flashcardSet.FolderID = updatedFlashcardSet.FolderID

	if result := h.DB.Save(&flashcardSet); result.Error != nil {
		http.Error(w, "Failed to update flashcard set", http.StatusInternalServerError)
		return
	}
}

func (h *FlashcardSetHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardSetID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var flashcardSet models.FlashcardSet
	if result := h.DB.First(&flashcardSet, flashcardSetID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "Flashcard set not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to retrieve flashcard set", http.StatusInternalServerError)
		}
		return
	}
	if result := h.DB.Delete(&flashcardSet, flashcardSetID); result.Error != nil {
		http.Error(w, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
