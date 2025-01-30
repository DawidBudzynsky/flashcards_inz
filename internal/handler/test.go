package handler

import (
	"encoding/json"
	"flashcards/internal/middlewares"
	"flashcards/internal/repositories"
	"flashcards/internal/service"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type TestHandler struct {
	Service *service.TestService
}

func (t *TestHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body repositories.CreateTestRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// TODO: create a function out of this
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}
	body.UserGoogleID = userGoogleID

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

func (t *TestHandler) GetUserResults(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	testID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "Invalid test ID", http.StatusBadRequest)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	testResults, err := t.Service.GetUserResults(userGoogleID, testID)
	if err != nil {
		http.Error(w, "Failed to fetch test result", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(testResults); err != nil {
		http.Error(w, "Failed to encode result", http.StatusInternalServerError)
	}
}

type AnswerRequest struct {
	UserGoogleID string         `json:"-"`
	TestID       string         `json:"testID"`
	Answers      map[int]string `json:"answers"`
}

// Verify the user's answers
func (h *TestHandler) VerifyAnswers(w http.ResponseWriter, r *http.Request) {
	var req AnswerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	correctAnswers := 0
	totalQuestions := len(req.Answers)

	// Verify each answer
	for flashcardID, userAnswer := range req.Answers {
		flashcard, err := h.Service.GetFlashcard(flashcardID)
		if err != nil {
			http.Error(w, "Couldn't retreive the card", http.StatusBadRequest)
			return
		}

		if userAnswer == flashcard.Answer {
			correctAnswers++
		}
	}

	// Return the verification result (number of correct answers)
	result := map[string]int{
		"correct":   correctAnswers,
		"incorrect": totalQuestions - correctAnswers,
		"total":     totalQuestions,
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	score := correctAnswers
	testID, err := strconv.ParseUint(req.TestID, 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("unable to retreive testID: %v", err), http.StatusInternalServerError)
		return
	}

	_, err = h.Service.SaveTestResult(userGoogleID, testID, req.Answers, score)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to save test result: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, "Failed to encode result", http.StatusInternalServerError)
	}
}

func (t *TestHandler) GetTestsForUser(w http.ResponseWriter, r *http.Request) {
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	// Get grouped tests
	groupedTests, err := t.Service.GetTestsGroupedByStatus(userGoogleID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the grouped data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(groupedTests)
}

func (t *TestHandler) CreateQuestions(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	testID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	// Check if the user has access to this test
	hasAccess := t.Service.DoesUserHaveAccess(userGoogleID, testID)
	if !hasAccess {
		http.Error(w, "You didn't apply for this test", http.StatusUnauthorized)
		return
	}

	// Retrieve the test by ID
	test, err := t.Service.GetTestByID(testID)
	if err != nil {
		http.Error(w, "Failed to get test", http.StatusInternalServerError)
		return
	}

	// Validate the test
	err = test.IsValid()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create the questions for the test
	questions, err := t.Service.CreateQuestions(test)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the created questions as usual
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(questions); err != nil {
		http.Error(w, "Failed to encode questions", http.StatusInternalServerError)
		return
	}
}

func (t *TestHandler) AccessTest(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")

	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	if token == "" {
		http.Error(w, "Invalid test link", http.StatusBadRequest)
		return
	}

	test, err := t.Service.GetTestByToken(token)
	if err != nil {
		http.Error(w, "Test not found", http.StatusNotFound)
		return
	}

	userID := userGoogleID
	if test.UserGoogleID != userID {
		err = t.Service.AssignTestToUser(userID, token)
		if err != nil {
			w.WriteHeader(http.StatusConflict) // 409 Conflict
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Test already assigned to the user.",
			})
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(test); err != nil {
		http.Error(w, "Failed to encode tests", http.StatusInternalServerError)
	}
}
