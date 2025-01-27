package service

import (
	"flashcards/internal/models"
	"flashcards/internal/repositories"
)

type FolderService struct {
	repo repositories.FolderRepoInterface
}

func NewFolderService(repo repositories.FolderRepoInterface) *FolderService {
	return &FolderService{repo: repo}
}

func (s *FolderService) CreateFolder(body repositories.CreateFolderRequest) (*models.Folder, error) {
	folder, err := s.repo.CreateFolder(body)
	if err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) ListFolders() ([]models.Folder, error) {
	folders, err := s.repo.ListFolders()
	if err != nil {
		return nil, err
	}
	return folders, nil
}

func (s *FolderService) GetUserFolders(userID string) ([]models.Folder, error) {
	folders, err := s.repo.GetUserFolders(userID)
	if err != nil {
		return nil, err
	}

	return folders, nil
}

func (s *FolderService) GetFolderByID(id uint64) (*models.Folder, error) {
	folder, err := s.repo.GetFolderByID(id)
	if err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) UpdateFolderByID(id uint64, updateData map[string]interface{}) (*models.Folder, error) {
	folder, err := s.repo.UpdateFolderByID(id, updateData)
	if err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) DeleteFolderByID(id uint64) error {
	if err := s.repo.DeleteFolderByID(id); err != nil {
		return err
	}
	return nil
}
