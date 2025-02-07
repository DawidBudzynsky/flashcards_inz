package service_test

import (
	"flashcards/internal/models"
	"flashcards/internal/service"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestToggleUserVisibility(t *testing.T) {
	t.Run("User isPrivate chnage to true", func(t *testing.T) {
		mockRepo := new(MockUserRepo)
		svc := service.NewUserSerivce(mockRepo)
		googleID := "test-google-id"
		mockUser := &models.User{
			GoogleID:  googleID,
			IsPrivate: false,
		}
		mockRepo.On("GetUserByGoogleID", googleID).Return(mockUser, nil)
		mockRepo.On("Save", mockUser).Return(nil)
		updatedUser, err := svc.ToggleVisibility(googleID)
		assert.NoError(t, err)

		// check the visibility after toggle
		assert.Equal(t, true, updatedUser.IsPrivate)
		mockRepo.AssertExpectations(t)
	})

	t.Run("User isPrivate chnage to false", func(t *testing.T) {
		mockRepo := new(MockUserRepo)
		svc := service.NewUserSerivce(mockRepo)
		googleID := "test-google-id"
		mockUser := &models.User{
			GoogleID:  googleID,
			IsPrivate: true,
		}

		mockRepo.On("GetUserByGoogleID", googleID).Return(mockUser, nil)
		mockRepo.On("Save", mockUser).Return(nil)
		updatedUser, err := svc.ToggleVisibility(googleID)
		assert.NoError(t, err)

		// check the visibility after toggle
		assert.Equal(t, false, updatedUser.IsPrivate)
		mockRepo.AssertExpectations(t)
	})
}
