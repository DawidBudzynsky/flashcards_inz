package repositories

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type FlashcardRepoInterface interface {
	CreateFlashcard(CreateFlashcardRequest) (*models.Flashcard, error)
	ListFlashcards() (models.Flashcards, error)
	GetFlashcardByID(uint64) (*models.Flashcard, error)
	UpdateFlashcardByID(uint64, UpdateFlashcardRequest) (*models.Flashcard, error)
	DeleteFlashcardByID(int) error
	DeleteTrackingByFlashcardID(flashcardID int) error
	Save(*models.Flashcard) error
}

type CreateFlashcardRequest struct {
	FlashcardSetID int    `json:"flashcard_set_id"`
	Question       string `json:"question"`
	Answer         string `json:"answer"`
}

type UpdateFlashcardRequest struct {
	ID             uint64 `json:"id"`
	FlashcardSetID int    `json:"flashcard_set_id"`
	Question       string `json:"question"`
	Answer         string `json:"answer"`
}

type FlashcardRepo struct {
	db *gorm.DB
}

func NewFlashcardRepo(db *gorm.DB) *FlashcardRepo {
	return &FlashcardRepo{db: db}
}

func (s *FlashcardRepo) CreateFlashcard(body CreateFlashcardRequest) (*models.Flashcard, error) {
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

func (s *FlashcardRepo) ListFlashcards() (models.Flashcards, error) {
	var flashcards models.Flashcards
	if err := s.db.Find(&flashcards).Error; err != nil {
		return nil, err
	}
	return flashcards, nil
}

func (s *FlashcardRepo) GetFlashcardByID(id uint64) (*models.Flashcard, error) {
	var flashcard models.Flashcard
	if err := s.db.Preload("Tracking").First(&flashcard, id).Error; err != nil {
		return nil, err
	}
	return &flashcard, nil
}

func (s *FlashcardRepo) UpdateFlashcardByID(id uint64, updateData UpdateFlashcardRequest) (*models.Flashcard, error) {
	flashcard, err := s.GetFlashcardByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(flashcard).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return flashcard, nil
}

func (s *FlashcardRepo) DeleteFlashcardByID(id int) error {
	if err := s.db.Delete(&models.Flashcard{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (s *FlashcardRepo) DeleteTrackingByFlashcardID(flashcardID int) error {
	return s.db.Where("flashcard_id = ?", flashcardID).Delete(&models.Tracking{}).Error
}

func (s *FlashcardRepo) Save(flashcard *models.Flashcard) error {
	if err := s.db.Save(flashcard).Error; err != nil {
		return err
	}
	return nil
}
