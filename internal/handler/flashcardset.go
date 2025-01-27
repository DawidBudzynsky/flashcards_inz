package handler

import (
	"encoding/json"
	"flashcards/internal/middlewares"
	"flashcards/internal/models"
	"flashcards/internal/repositories"
	"flashcards/internal/service"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type FlashcardSetHandler struct {
	Service *service.FlashcardSetService
}

func (h *FlashcardSetHandler) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Request URL:", r.URL.String())

	inFolder := r.URL.Query().Get("inFolder")
	var folderID uint64
	var err error
	if inFolder != "" {
		folderID, err = strconv.ParseUint(inFolder, 10, 64)
		if err != nil {
			http.Error(w, "Invalid folder ID", http.StatusBadRequest)
			return
		}
	}
	var body repositories.CreateFlashcardSetRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	body.UserGoogleID = userGoogleID

	flashcardSet, err := h.Service.CreateFlashcardSet(body)
	if err != nil {
		http.Error(w, "Failed to create flashcard set", http.StatusInternalServerError)
		return
	}

	if folderID != 0 {
		_, err = h.Service.AddFlashcardSetToFolder(uint64(flashcardSet.ID), folderID)
		if err != nil {
			http.Error(w, "Failed to add set to folder", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcard set", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) List(w http.ResponseWriter, r *http.Request) {
	var flashcardSets []models.FlashcardSet
	flashcardSets, err := h.Service.ListFlashcardSets()
	if err != nil {
		http.Error(w, "Failed to retrieve flashcard sets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSets); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) GetUserSets(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	var flashcardSets []models.FlashcardSet
	flashcardSets, err := h.Service.ListFlashcardSetsForUser(userGoogleID)
	if err != nil {
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

	flashcardSet, err := h.Service.GetFlashcardSetByID(setID)
	if err != nil {
		http.Error(w, "FlashcardSet not found", http.StatusInternalServerError)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	if flashcardSet.IsPrivate {
		// you are not owner
		if flashcardSet.UserGoogleID != userGoogleID {
			http.Error(w, "You dont have access", http.StatusNotFound)
			return

		}
	}

	response := map[string]interface{}{
		"set":     flashcardSet,
		"isOwner": flashcardSet.UserGoogleID == userGoogleID,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode flashcard", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) GetLearnSet(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	setID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "Invalid set ID", http.StatusBadRequest)
		return
	}

	flashcardSet, err := h.Service.GetFlashcardSetByID(setID)
	if err != nil {
		http.Error(w, "FlashcardSet not found", http.StatusInternalServerError)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	if flashcardSet.IsPrivate && flashcardSet.UserGoogleID != userGoogleID {
		http.Error(w, "You do not have access to this set", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcard set", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) GetEditSet(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	setID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "Invalid set ID", http.StatusBadRequest)
		return
	}

	flashcardSet, err := h.Service.GetFlashcardSetByID(setID)
	if err != nil {
		http.Error(w, "FlashcardSet not found", http.StatusInternalServerError)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	if flashcardSet.UserGoogleID != userGoogleID {
		http.Error(w, "Not your content", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcard set", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardSetID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	flashcardSet, err := h.Service.UpdateFlashcardSetByID(flashcardSetID, updateData)
	if err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
	}
}

func (h *FlashcardSetHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardSetID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := h.Service.DeleteFlashcardSetByID(flashcardSetID); err != nil {
		http.Error(w, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *FlashcardSetHandler) AddSetToFolder(w http.ResponseWriter, r *http.Request) {
	// Parse the JSON request body
	var requestData struct {
		FlashcardSetID uint64 `json:"FlashcardSetID"`
		FolderID       uint64 `json:"FolderID"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Call the service to add the flashcard set to the folder
	flashcardSet, err := h.Service.AddFlashcardSetToFolder(requestData.FlashcardSetID, requestData.FolderID)
	if err != nil {
		http.Error(w, "Failed to append set to folder", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	// Respond with the updated flashcard set
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
		return
	}
}

func (h *FlashcardSetHandler) RemoveSetFromFolder(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		FlashcardSetID uint64 `json:"FlashcardSetID"`
		FolderID       uint64 `json:"FolderID"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	flashcardSet, err := h.Service.RemoveSetFromFolder(requestData.FlashcardSetID, requestData.FolderID)
	if err != nil {
		http.Error(w, "Failed to append set to folder", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
		return
	}
}

func (h *FlashcardSetHandler) ChangeSetFolder(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		FlashcardSetID uint64 `json:"FlashcardSetID"`
		OldFolderID    uint64 `json:"OldFolderID"`
		FolderID       uint64 `json:"FolderID"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// check if new folder already has this set
	exists, err := h.Service.CheckSetInFolder(requestData.FlashcardSetID, requestData.FolderID)
	if err != nil {
		http.Error(w, "Error checking folder contents", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	if exists {
		http.Error(w, "Flashcard set already exists in the target folder", http.StatusConflict)
		return
	}

	_, err = h.Service.RemoveSetFromFolder(requestData.FlashcardSetID, requestData.OldFolderID)
	if err != nil {
		http.Error(w, "Failed to append set to folder", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	flashcardSet, err := h.Service.AddFlashcardSetToFolder(requestData.FlashcardSetID, requestData.FolderID)
	if err != nil {
		http.Error(w, "Failed to append set to folder", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
		return
	}
}

func (h *FlashcardSetHandler) ToggleVisibility(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	flashcardSetID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	flashcardSet, err := h.Service.GetFlashcardSetByID(flashcardSetID)
	if err != nil {
		http.Error(w, "Failed to append set to folder", http.StatusInternalServerError)
		return
	}

	if flashcardSet.UserGoogleID != userGoogleID {
		http.Error(w, "Failed to append set to folder", http.StatusNotFound)
		return
	}

	err = h.Service.ToggleVisibility(flashcardSetID)
	if err != nil {
		http.Error(w, "Failed to toggle set visibility", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcardSet); err != nil {
		http.Error(w, "Failed to encode flashcardSet", http.StatusInternalServerError)
		return
	}
}
