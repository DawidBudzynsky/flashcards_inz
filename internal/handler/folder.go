package handler

import (
	"encoding/json"
	"flashcards/internal/middlewares"
	"flashcards/internal/repositories"
	"flashcards/internal/service"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type FolderHandler struct {
	Service *service.FolderService
}

func (h *FolderHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body repositories.CreateFolderRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// TODO: make it as a function (prob in util or all types of request should have this function)
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	body.UserGoogleID = userGoogleID

	folder, err := h.Service.CreateFolder(body)
	if err != nil {
		http.Error(w, "Failed to create folder", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(folder); err != nil {
		http.Error(w, "Failed to encode folder", http.StatusInternalServerError)
	}
}

func (h *FolderHandler) List(w http.ResponseWriter, r *http.Request) {
	folders, err := h.Service.ListFolders()
	if err != nil {
		http.Error(w, "Failed to list folders", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(folders); err != nil {
		http.Error(w, "Failed to encode folders", http.StatusInternalServerError)
	}
}

func (h *FolderHandler) GetUserFolders(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	folders, err := h.Service.GetUserFolders(userGoogleID)
	if err != nil {
		http.Error(w, "Failed to list folders", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(folders); err != nil {
		http.Error(w, "Failed to encode folders", http.StatusInternalServerError)
	}
}

func (h *FolderHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	folderID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	folder, err := h.Service.GetFolderByID(folderID)
	if err != nil {
		http.Error(w, "Folder not found", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(folder); err != nil {
		http.Error(w, "Failed to encode folder", http.StatusInternalServerError)
	}
}

func (h *FolderHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	folderID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	folder, err := h.Service.UpdateFolderByID(folderID, updateData)
	if err != nil {
		http.Error(w, "Failed to update folder", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(folder); err != nil {
		http.Error(w, "Failed to encode folder", http.StatusInternalServerError)
	}
}

func (h *FolderHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	folderID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := h.Service.DeleteFolderByID(folderID); err != nil {
		http.Error(w, "Failed to delete folder", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
