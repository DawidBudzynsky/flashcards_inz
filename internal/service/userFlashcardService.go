package service

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type UserFlashcardService struct {
	db *gorm.DB
}

func NewUserFlashcardService(db *gorm.DB) *UserFlashcardService {
	return &UserFlashcardService{db: db}
}

func (s *UserFlashcardService) GetByCardID(cardID int) (*models.UserFlashcard, error) {
	var userFlashcard models.UserFlashcard
	err := s.db.First(&userFlashcard, "flashcardid = ?", cardID).Error
	if err == nil {
		return &userFlashcard, nil
	}

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return nil, err
}
