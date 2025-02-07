package service_test

import (
	"flashcards/internal/models"
	"flashcards/internal/service"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUpdateFlashcardSetByID(t *testing.T) {
	mockRepo := new(MockFlashcardSetRepo)
	mockFlashcardService := new(MockFlashcardService)
	svc := service.FlashcardSetService{Repo: mockRepo, FlashcardService: mockFlashcardService}

	existingSet := &models.FlashcardSet{
		ID:          1,
		Title:       "Old Title",
		Description: "Old Description",
		Flashcards:  models.Flashcards{{ID: 1}, {ID: 2}},
	}

	updateData := map[string]interface{}{
		"Title":       "New Title",
		"Description": "New Description",
		"Flashcards":  models.Flashcards{{ID: 2}, {ID: 3}},
	}

	mockRepo.On("GetFlashcardSetByID", uint64(1)).Return(existingSet, nil)
	mockFlashcardService.On("DeleteFlashcardByID", 1).Return(nil)
	mockRepo.On("UpdateFlashcardSetByID", uint64(1), mock.Anything).Return(&models.FlashcardSet{
		ID:          1,
		Title:       "New Title",
		Description: "New Description",
		Flashcards:  models.Flashcards{{ID: 2}, {ID: 3}},
	}, nil)

	updatedSet, err := svc.UpdateFlashcardSetByID(1, updateData)

	assert.NoError(t, err)
	assert.Equal(t, "New Title", updatedSet.Title)
	assert.Equal(t, "New Description", updatedSet.Description)
	assert.Len(t, updatedSet.Flashcards, 2)
	mockRepo.AssertExpectations(t)
	mockFlashcardService.AssertExpectations(t)
}

func TestCreateMapOfFlashcardsIDS(t *testing.T) {
	flashcards := models.Flashcards{
		{ID: 1}, {ID: 2}, {ID: 3}, {ID: 0},
	}

	expectedMap := map[int]bool{
		1: true,
		2: true,
		3: true,
	}

	result := service.CreateMapOfFlashcardsIDS(flashcards)

	assert.Equal(t, expectedMap, result)
}
