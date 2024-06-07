package handler

import (
	"encoding/json"
	"flashcards/internal/service"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type TestHandler struct {
	Service service.TestServiceInterface
}

func (t *TestHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body service.CreateTestRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	test, err := t.Service.CreateTest(body)
	if err != nil {
		http.Error(w, "Failed to create test", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(test); err != nil {
		http.Error(w, "Failed to encode test", http.StatusInternalServerError)
	}
}

func (t *TestHandler) List(w http.ResponseWriter, r *http.Request) {
	tests, err := t.Service.ListTests()
	if err != nil {
		http.Error(w, "Failed to list tests", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tests); err != nil {
		http.Error(w, "Failed to encode tests", http.StatusInternalServerError)
	}
}

func (t *TestHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	testID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	test, err := t.Service.GetTestByID(testID)
	if err != nil {
		http.Error(w, "Test not found", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(test); err != nil {
		http.Error(w, "Failed to encode test", http.StatusInternalServerError)
	}
}

func (t *TestHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	testID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	test, err := t.Service.UpdateTestByID(testID, updateData)
	if err != nil {
		http.Error(w, "Failed to update test", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(test); err != nil {
		http.Error(w, "Failed to encode test", http.StatusInternalServerError)
	}
}

func (t *TestHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	testID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if err := t.Service.DeleteTestByID(testID); err != nil {
		http.Error(w, "Failed to delete test", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
