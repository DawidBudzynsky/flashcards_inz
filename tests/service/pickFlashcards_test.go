package service_test

import (
	"flashcards/internal/models"
	"flashcards/internal/service"
	"testing"
)

func TestPickFlashcards(t *testing.T) {
	set1 := models.FlashcardSet{
		Flashcards: []models.Flashcard{
			{ID: 1, Question: "Q1", Answer: "A1"},
			{ID: 2, Question: "Q2", Answer: "A2"},
			{ID: 3, Question: "Q3", Answer: "A3"},
		},
	}
	set2 := models.FlashcardSet{
		Flashcards: []models.Flashcard{
			{ID: 4, Question: "Q4", Answer: "A4"},
			{ID: 5, Question: "Q5", Answer: "A5"},
			{ID: 6, Question: "Q6", Answer: "A6"},
		},
	}
	set3 := models.FlashcardSet{
		Flashcards: []models.Flashcard{
			{ID: 7, Question: "Q7", Answer: "A7"},
		},
	}

	sets := []models.FlashcardSet{set1, set2, set3}
	numQuestions := 5

	handler := &service.TestService{}

	selectedFlashcards, err := handler.PickFlashcards(sets, numQuestions)
	if err != nil {
		t.Fatalf("Error selecting flashcards: %v", err)
	}

	if len(selectedFlashcards) != numQuestions {
		t.Errorf("Expected %d flashcards, but got %d", numQuestions, len(selectedFlashcards))
	}

	flashcardsInSet1 := 0
	flashcardsInSet2 := 0
	flashcardsInSet3 := 0

	for _, fc := range selectedFlashcards {
		if fc.ID == 1 || fc.ID == 2 || fc.ID == 3 {
			flashcardsInSet1++
		} else if fc.ID == 4 || fc.ID == 5 || fc.ID == 6 {
			flashcardsInSet2++
		} else if fc.ID == 7 {
			flashcardsInSet3++
		}
	}

	if flashcardsInSet1 != 2 {
		t.Errorf("Set 1 should have 2 flashcards, but got %d", flashcardsInSet1)
	}
	if flashcardsInSet2 != 2 {
		t.Errorf("Set 2 should have 2 flashcards, but got %d", flashcardsInSet2)
	}
	if flashcardsInSet3 != 1 {
		t.Errorf("Set 3 should have 1 flashcard, but got %d", flashcardsInSet3)
	}

	emptySet := models.FlashcardSet{}
	setsWithEmptySet := append(sets, emptySet)
	selectedFlashcards, err = handler.PickFlashcards(setsWithEmptySet, 4)
	if err != nil {
		t.Fatalf("Error selecting flashcards with an empty set: %v", err)
	}
	if len(selectedFlashcards) != 4 {
		t.Errorf("Expected 4 flashcards, but got %d", len(selectedFlashcards))
	}
}
