package repositories

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type FolderRepoInterface interface {
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

type FolderRepo struct {
	db *gorm.DB
}

func NewFolderRepo(db *gorm.DB) *FolderRepo {
	return &FolderRepo{db: db}
}

func (s *FolderRepo) CreateFolder(body CreateFolderRequest) (*models.Folder, error) {
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

func (s *FolderRepo) ListFolders() ([]models.Folder, error) {
	var folders models.Folders
	if err := s.db.Preload("FlashcardsSet").Find(&folders).Error; err != nil {
		return nil, err
	}
	return folders, nil
}

func (s *FolderRepo) GetUserFolders(userID string) ([]models.Folder, error) {
	var folders []models.Folder

	if err := s.db.Preload("FlashcardsSets").Where("user_google_id = ?", userID).Find(&folders).Error; err != nil {
		return nil, err
	}

	return folders, nil
}

func (s *FolderRepo) GetFolderByID(id uint64) (*models.Folder, error) {
	var folder models.Folder
	if err := s.db.Preload("FlashcardsSets").First(&folder, id).Error; err != nil {
		return nil, err
	}
	return &folder, nil
}

func (s *FolderRepo) UpdateFolderByID(id uint64, updateData map[string]interface{}) (*models.Folder, error) {
	folder, err := s.GetFolderByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(folder).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderRepo) DeleteFolderByID(id uint64) error {
	if err := s.db.Delete(&models.Folder{}, id).Error; err != nil {
		return err
	}
	return nil
}
