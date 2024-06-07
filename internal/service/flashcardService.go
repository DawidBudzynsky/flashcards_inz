package service

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type FlashcardServiceInterface interface {
	CreateFlashcard(CreateFlashcardRequest) (*models.Flashcard, error)
	ListFlashcards() (models.Flashcards, error)
	GetFlashcardByID(uint64) (*models.Flashcard, error)
	UpdateFlashcardByID(uint64, map[string]interface{}) (*models.Flashcard, error)
	DeleteFlashcardByID(uint64) error
}

type CreateFlashcardRequest struct {
	FlashcardSetID int    `json:"flashcard_set_id"`
	Question       string `json:"question"`
	Answer         string `json:"answer"`
}

type FlashcardService struct {
	db *gorm.DB
}

func NewFlashcardService(db *gorm.DB) *FlashcardService {
	return &FlashcardService{db: db}
}

func (s *FlashcardService) CreateFlashcard(body CreateFlashcardRequest) (*models.Flashcard, error) {
	flashcard := &models.Flashcard{
		FlashcardSetID: body.FlashcardSetID,
		Question:       body.Question,
		Answer:         body.Answer,
	}
	if err := s.db.Create(flashcard).Error; err != nil {
		return nil, err
	}
	return flashcard, nil
}

func (s *FlashcardService) ListFlashcards() (models.Flashcards, error) {
	var flashcards models.Flashcards
	if err := s.db.Find(&flashcards).Error; err != nil {
		return nil, err
	}
	return flashcards, nil
}

func (s *FlashcardService) GetFlashcardByID(id uint64) (*models.Flashcard, error) {
	var flashcard models.Flashcard
	if err := s.db.First(&flashcard, id).Error; err != nil {
		return nil, err
	}
	return &flashcard, nil
}

func (s *FlashcardService) UpdateFlashcardByID(id uint64, updateData map[string]interface{}) (*models.Flashcard, error) {
	flashcard, err := s.GetFlashcardByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(flashcard).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return flashcard, nil
}

func (s *FlashcardService) DeleteFlashcardByID(id uint64) error {
	if err := s.db.Delete(&models.Flashcard{}, id).Error; err != nil {
		return err
	}
	return nil
}
