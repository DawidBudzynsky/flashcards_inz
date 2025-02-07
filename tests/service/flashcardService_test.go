package service_test

import (
	"errors"
	"flashcards/internal/models"
	"flashcards/internal/service"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestToggleTracking_EnableTracking(t *testing.T) {
	t.Run("Toggling tracking on", func(t *testing.T) {
		mockRepo := new(MockFlashcardRepo)
		svc := service.FlashcardService{Repo: mockRepo}
		flashcard := &models.Flashcard{ID: 1, Tracking: nil}

		mockRepo.On("GetFlashcardByID", uint64(1)).Return(flashcard, nil)
		mockRepo.On("Save", mock.Anything).Return(nil)

		err := svc.ToggleTracking(1)

		assert.NoError(t, err)
		assert.NotNil(t, flashcard.Tracking)
		assert.Equal(t, float64(2.5), flashcard.Tracking.Easiness)
		mockRepo.AssertExpectations(t)
	})

	t.Run("Toggling tracking off", func(t *testing.T) {
		mockRepo := new(MockFlashcardRepo)
		svc := service.FlashcardService{Repo: mockRepo}
		flashcard := &models.Flashcard{
			ID:       1,
			Tracking: &models.Tracking{Easiness: 2.5, ConsecutiveCorrectAnswers: 1},
		}

		mockRepo.On("GetFlashcardByID", uint64(1)).Return(flashcard, nil)
		mockRepo.On("DeleteTrackingByFlashcardID", 1).Return(nil)
		mockRepo.On("Save", mock.Anything).Return(nil)

		err := svc.ToggleTracking(1)

		assert.NoError(t, err)
		assert.Nil(t, flashcard.Tracking)
		mockRepo.AssertExpectations(t)
	})

	t.Run("Toggling tracking found error", func(t *testing.T) {
		mockRepo := new(MockFlashcardRepo)
		svc := service.FlashcardService{Repo: mockRepo}

		mockRepo.On("GetFlashcardByID", uint64(1)).Return((*models.Flashcard)(nil), errors.New("not found"))

		err := svc.ToggleTracking(1)

		assert.Error(t, err)
		assert.Equal(t, "not found", err.Error())
		mockRepo.AssertExpectations(t)
	})
}
