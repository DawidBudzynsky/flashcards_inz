package service

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type FlashcardSetInterface interface {
	CreateFlashcardSet(CreateFlashcardSetRequest) (*models.FlashcardSet, error)
	ListFlashcardSets() (models.FlashcardsSets, error)
	GetFlashcardSetByID(uint64) (*models.FlashcardSet, error)
	UpdateFlashcardSetByID(uint64, map[string]interface{}) (*models.FlashcardSet, error)
	DeleteFlashcardSetByID(uint64) error
}

const flashcards = "Flashcards"

type CreateFlashcardSetRequest struct {
	UserGoogleID string `json:"-"` // TODO: maybe not today
	Title        string `json:"title"`
	Description  string `json:"description"`
	FolderID     int    `json:"folder_id"`
}

type FlashcardSetService struct {
	db *gorm.DB
}

func NewFlashcardSetService(db *gorm.DB) *FlashcardSetService {
	return &FlashcardSetService{db: db}
}

// TODO: should add each flashcard inside the request
// TODO: or first on frontend send create set and then add flashcards to sets
func (s *FlashcardSetService) CreateFlashcardSet(body CreateFlashcardSetRequest) (*models.FlashcardSet, error) {
	flashcardSet := &models.FlashcardSet{
		UserGoogleID: body.UserGoogleID,
		Title:        body.Title,
		Description:  body.Description,
		FolderID:     body.FolderID,
	}

	if err := s.db.Create(flashcardSet).Error; err != nil {
		return nil, err
	}
	return flashcardSet, nil
}

func (s *FlashcardSetService) ListFlashcardSets() (models.FlashcardsSets, error) {
	var flashcardSets models.FlashcardsSets
	if err := s.db.Preload(flashcards).Find(&flashcardSets).Error; err != nil {
		return nil, err
	}
	return flashcardSets, nil
}

func (s *FlashcardSetService) GetFlashcardSetByID(id uint64) (*models.FlashcardSet, error) {
	var flashcardSet models.FlashcardSet
	if err := s.db.Preload(flashcards).First(&flashcardSet, id).Error; err != nil {
		return nil, err
	}
	return &flashcardSet, nil
}

func (s *FlashcardSetService) UpdateFlashcardSetByID(id uint64, updateData map[string]interface{}) (*models.FlashcardSet, error) {
	flashcardSet, err := s.GetFlashcardSetByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(flashcardSet).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return flashcardSet, nil
}

func (s *FlashcardSetService) DeleteFlashcardSetByID(id uint64) error {
	if err := s.db.Delete(&models.FlashcardSet{}, id).Error; err != nil {
		return err
	}
	return nil
}
