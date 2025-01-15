package repositories

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type FlashcardSetRepoInterface interface {
	CreateFlashcardSet(CreateFlashcardSetRequest) (*models.FlashcardSet, error)
	ListFlashcardSets() (models.FlashcardsSets, error)
	GetFlashcardSetByID(uint64) (*models.FlashcardSet, error)
	UpdateFlashcardSetByID(uint64, map[string]interface{}) (*models.FlashcardSet, error)
	DeleteFlashcardSetByID(uint64) error
	AddFlashcardSetToFolder(uint64, uint64) (*models.FlashcardSet, error)
}

const (
	flashcards     = "Flashcards"
	userFlashcards = "UserFlashcards"
)

type CreateFlashcardSetRequest struct {
	UserGoogleID string `json:"-"` // TODO: maybe not today
	Title        string `json:"title"`
	Description  string `json:"description"`
	FolderID     int    `json:"folder_id"`
}

type FlashcardSetRepo struct {
	db *gorm.DB
}

func NewFlashcardSetRepo(db *gorm.DB) *FlashcardSetRepo {
	return &FlashcardSetRepo{db: db}
}

// TODO: should add each flashcard inside the request
// TODO: or first on frontend send create set and then add flashcards to sets
func (s *FlashcardSetRepo) CreateFlashcardSet(body CreateFlashcardSetRequest) (*models.FlashcardSet, error) {
	flashcardSet := &models.FlashcardSet{
		UserGoogleID: body.UserGoogleID,
		Title:        body.Title,
		Description:  body.Description,
	}

	if err := s.db.Create(flashcardSet).Error; err != nil {
		return nil, err
	}
	return flashcardSet, nil
}

func (s *FlashcardSetRepo) ListFlashcardSets() (models.FlashcardsSets, error) {
	var flashcardSets models.FlashcardsSets
	if err := s.db.Preload(flashcards).Find(&flashcardSets).Error; err != nil {
		return nil, err
	}
	return flashcardSets, nil
}

func (s *FlashcardSetRepo) GetFlashcardSetByID(id uint64) (*models.FlashcardSet, error) {
	var flashcardSet models.FlashcardSet
	if err := s.db.Preload(flashcards).Preload("Flashcards.Tracking").First(&flashcardSet, id).Error; err != nil {
		return nil, err
	}
	return &flashcardSet, nil
}

func (s *FlashcardSetRepo) UpdateFlashcardSetByID(id uint64, updateData *models.FlashcardSet) (*models.FlashcardSet, error) {
	if err := s.db.Session(&gorm.Session{FullSaveAssociations: true}).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return updateData, nil
}

// func (s *FlashcardSetRepo) UpdateFlashcardSetByID(id uint64, updateData map[string]interface{}) (*models.FlashcardSet, error) {
// 	flashcardSet, err := s.GetFlashcardSetByID(id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	if err := s.db.Model(flashcardSet).FullSaveAssociations.Updates(updateData).Error; err != nil {
// 		return nil, err
// 	}
// 	return flashcardSet, nil
// }

func (s *FlashcardSetRepo) AddFlashcardSetToFolder(id, folderID uint64) (*models.FlashcardSet, error) {
	// Get the flashcard set by ID
	flashcardSet, err := s.GetFlashcardSetByID(id)
	if err != nil {
		return nil, err
	}

	// Get the folder by ID
	var folder models.Folder
	if err := s.db.First(&folder, folderID).Error; err != nil {
		return nil, err
	}

	// Append the flashcard set to the folder's association
	if err := s.db.Model(&folder).Association("FlashcardsSets").Append(flashcardSet); err != nil {
		return nil, err
	}

	return flashcardSet, nil
}

func (s *FlashcardSetRepo) RemoveSetFromFolder(id, folderID uint64) (*models.FlashcardSet, error) {
	// Get the flashcard set by ID
	flashcardSet, err := s.GetFlashcardSetByID(id)
	if err != nil {
		return nil, err
	}

	// Get the folder by ID
	var folder models.Folder
	if err := s.db.First(&folder, folderID).Error; err != nil {
		return nil, err
	}

	// Remove the flashcard set from the folder's association
	if err := s.db.Model(&folder).Association("FlashcardsSets").Delete(flashcardSet); err != nil {
		return nil, err
	}

	return flashcardSet, nil
}

func (s *FlashcardSetRepo) DeleteFlashcardSetByID(id uint64) error {
	if err := s.db.Delete(&models.FlashcardSet{}, id).Error; err != nil {
		return err
	}
	return nil
}
