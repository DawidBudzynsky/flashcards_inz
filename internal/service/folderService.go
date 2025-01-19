package service

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type FolderServiceInterface interface {
	CreateFolder(CreateFolderRequest) (*models.Folder, error)
	ListFolders() ([]models.Folder, error)
	GetUserFolders(string) ([]models.Folder, error)
	GetFolderByID(uint64) (*models.Folder, error)
	UpdateFolderByID(uint64, map[string]interface{}) (*models.Folder, error)
	DeleteFolderByID(uint64) error
}

type CreateFolderRequest struct {
	UserGoogleID string `json:"-"`
	Name         string `json:"name"`
	Description  string `json:"description"`
}

type FolderService struct {
	db *gorm.DB
}

func NewFolderService(db *gorm.DB) *FolderService {
	return &FolderService{db: db}
}

func (s *FolderService) CreateFolder(body CreateFolderRequest) (*models.Folder, error) {
	folder := &models.Folder{
		UserGoogleID: body.UserGoogleID,
		Name:         body.Name,
		Description:  body.Description,
	}
	if err := s.db.Create(folder).Error; err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) ListFolders() ([]models.Folder, error) {
	var folders models.Folders
	if err := s.db.Preload(flashcard_sets).Find(&folders).Error; err != nil {
		return nil, err
	}
	return folders, nil
}

func (s *FolderService) GetUserFolders(userID string) ([]models.Folder, error) {
	var folders []models.Folder

	if err := s.db.Preload("FlashcardsSets").Where("user_google_id = ?", userID).Find(&folders).Error; err != nil {
		return nil, err
	}

	return folders, nil
}

func (s *FolderService) GetFolderByID(id uint64) (*models.Folder, error) {
	var folder models.Folder
	if err := s.db.Preload(flashcard_sets).First(&folder, id).Error; err != nil {
		return nil, err
	}
	return &folder, nil
}

func (s *FolderService) UpdateFolderByID(id uint64, updateData map[string]interface{}) (*models.Folder, error) {
	folder, err := s.GetFolderByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(folder).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) DeleteFolderByID(id uint64) error {
	if err := s.db.Delete(&models.Folder{}, id).Error; err != nil {
		return err
	}
	return nil
}
