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
	err := s.db.First(&userFlashcard, "flashcard_id = ?", cardID).Error
	if err == nil {
		return &userFlashcard, nil
	}

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return nil, err
}

type CreateUserFlashcardRequest struct {
	UserGoogleID              string `json:"google_id"`
	FlashcardID               string `json:"username"`
	Easiness                  string `json:"email"`
	ConsecutiveCorrectAnswers string `json:"role"`
}

func (s *UserFlashcardService) Create(body *models.UserFlashcard) (*models.UserFlashcard, error) {
	if err := s.db.Create(body).Error; err != nil {
		return nil, err
	}

	return body, nil
}

func (s *UserFlashcardService) UpdateByID(id int, body *models.UserFlashcard) (*models.UserFlashcard, error) {
	userFlashcard, err := s.GetByCardID(id)
	if err != nil {
		return nil, err
	}

	if err := s.db.Model(&models.UserFlashcard{}).Where("flashcard_id = ?", id).Updates(body).Error; err != nil {
		return nil, err
	}
	return userFlashcard, nil
}
