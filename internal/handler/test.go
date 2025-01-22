package handler

import (
	"encoding/json"
	"errors"
	"flashcards/internal/middlewares"
	"flashcards/internal/models"
	"flashcards/internal/service"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

type Question struct {
	FlashcardID     int      `json:"id"`
	QuestionText    string   `json:"question_text"`
	PossibleAnswers []string `json:"possible_answers"`
}

type TestHandler struct {
	Service service.TestServiceInterface
}

func (t *TestHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body service.CreateTestRequest
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

type AnswerRequest struct {
	UserGoogleID string         `json:"-"`
	TestID       string         `json:testID`
	Answers      map[int]string `json:"answers"` // Key is question ID, value is the selected answer
}

// Verify the user's answers
func (h *TestHandler) VerifyAnswers(w http.ResponseWriter, r *http.Request) {
	var req AnswerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	fmt.Println(req.Answers)

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

	hasAccess := t.Service.DoesUserHaveAccess(userGoogleID, testID)
	if !hasAccess {
		http.Error(w, "You didn't apply for this test", http.StatusUnauthorized)
		return
	}

	test, err := t.Service.GetTestByID(testID)
	if err != nil {
		http.Error(w, "Failed to get test", http.StatusInternalServerError)
		return
	}

	err = test.IsValid()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	questions, err := t.createQuestions(test)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(questions); err != nil {
		http.Error(w, "Failed to encode test", http.StatusInternalServerError)
		return
	}
}

func (f *TestHandler) createQuestions(test *models.Test) ([]Question, error) {
	pickedFlashcards, err := f.PickFlashcards(test.Sets, test.NumQuestions)
	if err != nil {
		return nil, err
	}

	var questions []Question
	for _, flashcard := range pickedFlashcards {
		possibleAnswers, err := f.createAnswers(flashcard, test.Sets)
		if err != nil {
			return nil, err
		}
		questions = append(questions, Question{
			FlashcardID:     flashcard.ID,
			QuestionText:    flashcard.Question,
			PossibleAnswers: possibleAnswers,
		})
	}

	return questions, nil
}

func (f *TestHandler) PickFlashcards(sets []models.FlashcardSet, numQuestions int) ([]models.Flashcard, error) {
	var selectedFlashcards []models.Flashcard
	var totalFlashcards int

	for _, set := range sets {
		totalFlashcards += len(set.Flashcards)
	}

	if totalFlashcards == 0 {
		return nil, errors.New("no flashcards available in the provided sets")
	}

	questionsPerSet := make([]int, len(sets))
	remainder := numQuestions

	for i, set := range sets {
		if len(set.Flashcards) == 0 {
			questionsPerSet[i] = 0
			continue
		}
		questionsPerSet[i] = int(float64(numQuestions) * (float64(len(set.Flashcards)) / float64(totalFlashcards)))
		remainder -= questionsPerSet[i]
	}

	for i, set := range sets {
		if len(set.Flashcards) > 0 && questionsPerSet[i] == 0 {
			questionsPerSet[i] = 1
			remainder--
		}
	}

	for remainder > 0 {
		for i, set := range sets {
			if remainder == 0 {
				break
			}
			if len(set.Flashcards) > questionsPerSet[i] {
				questionsPerSet[i]++
				remainder--
			}
		}
	}

	rand.Seed(time.Now().UnixNano())
	for i, set := range sets {
		if questionsPerSet[i] > len(set.Flashcards) {
			return nil, errors.New("not enough flashcards in a set to meet the requested number")
		}

		rand.Shuffle(len(set.Flashcards), func(i, j int) {
			set.Flashcards[i], set.Flashcards[j] = set.Flashcards[j], set.Flashcards[i]
		})

		selectedFlashcards = append(selectedFlashcards, set.Flashcards[:questionsPerSet[i]]...)
	}

	if len(selectedFlashcards) != numQuestions {
		return nil, fmt.Errorf("unable to select the exact number of flashcards: selected %d, requested %d", len(selectedFlashcards), numQuestions)
	}

	return selectedFlashcards, nil
}

func (f *TestHandler) createAnswers(flashcard models.Flashcard, sets []models.FlashcardSet) ([]string, error) {
	// TODO: right now there will be no correct answers used as possible answers, maybe try to change it
	var possibleAnswers []string
	for _, set := range sets {
		for _, card := range set.Flashcards {
			if card.ID != flashcard.ID {
				possibleAnswers = append(possibleAnswers, card.Answer)
			}
		}
	}
	if len(possibleAnswers) < 3 {
		// If there are not enough possible incorrect answers, we need to handle this case.
		// Maybe you can return an error or simply duplicate answers until there are enough.
		return nil, errors.New("not enough incorrect answers")
	}
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(possibleAnswers), func(i, j int) {
		possibleAnswers[i], possibleAnswers[j] = possibleAnswers[j], possibleAnswers[i]
	})
	incorrectAnswers := possibleAnswers[:3]
	allAnswers := append(incorrectAnswers, flashcard.Answer)
	rand.Shuffle(len(allAnswers), func(i, j int) {
		allAnswers[i], allAnswers[j] = allAnswers[j], allAnswers[i]
	})

	return allAnswers, nil
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

	// Get the test using the token
	test, err := t.Service.GetTestByToken(token)
	if err != nil {
		http.Error(w, "Test not found", http.StatusNotFound)
		return
	}

	userID := userGoogleID
	if test.UserGoogleID != userID {
		// user is not the author of a test, assign the test
		err = t.Service.AssignTestToUser(userID, token)
		if err != nil {
			http.Error(w, "Failed to assign test", http.StatusInternalServerError)
			return
		}
	}

	// http.Redirect(w, r, fmt.Sprintf("/user/%s/tests/%d", userID, test.ID), http.StatusFound)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(test); err != nil {
		http.Error(w, "Failed to encode tests", http.StatusInternalServerError)
	}
}
