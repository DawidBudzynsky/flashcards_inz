package service

import (
	"encoding/json"
	"flashcards/internal/models"
	"flashcards/internal/repositories"
)

const flashcards = "Flashcards"

type FlashcardSetService struct {
	Repo             *repositories.FlashcardSetRepo
	FlashcardService *FlashcardService
}

func NewFlashcardSetService(repository *repositories.FlashcardSetRepo, flashcardService *FlashcardService) *FlashcardSetService {
	return &FlashcardSetService{
		Repo:             repository,
		FlashcardService: flashcardService,
	}
}

func (s *FlashcardSetService) CreateFlashcardSet(body repositories.CreateFlashcardSetRequest) (*models.FlashcardSet, error) {
	// buisiness logic here
	//
	newFlashcardSet, err := s.Repo.CreateFlashcardSet(body)
	if err != nil {
		return nil, err
	}
	return newFlashcardSet, nil
}

func (s *FlashcardSetService) ListFlashcardSets(isPublic bool) (models.FlashcardsSets, error) {
	flashcardsSets, err := s.Repo.ListFlashcardSets()
	if err != nil {
		return nil, err
	}

	if isPublic {
		var publicSets models.FlashcardsSets
		for _, set := range flashcardsSets {
			if !set.IsPrivate { // assuming the FlashcardSet model has an IsPrivate field
				publicSets = append(publicSets, set)
			}
		}
		return publicSets, nil
	}
	return flashcardsSets, nil
}

func (s *FlashcardSetService) ListFlashcardSetsForUser(userID string) (models.FlashcardsSets, error) {
	// buisiness logic here
	//
	flashcardsSets, err := s.Repo.ListFlashcardSetsForUser(userID)
	if err != nil {
		return nil, err
	}
	return flashcardsSets, nil
}

func (s *FlashcardSetService) GetFlashcardSetByID(id uint64) (*models.FlashcardSet, error) {
	// buisiness logic here
	//
	flashcardSet, err := s.Repo.GetFlashcardSetByID(id)
	if err != nil {
		return nil, err
	}
	return flashcardSet, nil
}

func (s *FlashcardSetService) UpdateFlashcardSetByID(id uint64, updateData map[string]interface{}) (*models.FlashcardSet, error) {
	// buisiness logic here
	//
	//
	updateJSON, err := json.Marshal(updateData)
	if err != nil {
		return nil, err
	}

	var updateFlashcardSet models.FlashcardSet
	if err := json.Unmarshal(updateJSON, &updateFlashcardSet); err != nil {
		return nil, err
	}

	existingSet, err := s.Repo.GetFlashcardSetByID(id)
	if err != nil {
		return nil, err
	}

	// delete non existand flashcards
	idsMap := createMapOfFlashcardsIDS(updateFlashcardSet.Flashcards)
	for _, existingFlashcard := range existingSet.Flashcards {
		if !idsMap[existingFlashcard.ID] {
			if err := s.FlashcardService.DeleteFlashcardByID(existingFlashcard.ID); err != nil {
				return nil, err
			}
		}
	}

	// update Set data
	existingSet.Title = updateFlashcardSet.Title
	existingSet.Description = updateFlashcardSet.Description
	existingSet.Flashcards = updateFlashcardSet.Flashcards

	flashcardSet, err := s.Repo.UpdateFlashcardSetByID(id, existingSet)
	if err != nil {
		return nil, err
	}

	return flashcardSet, nil
}

func (s *FlashcardSetService) AddFlashcardSetToFolder(id, folderID uint64) (*models.FlashcardSet, error) {
	// buisiness logic here
	//
	// TODO: change it later to make all buisiness logic here
	flashcardSet, err := s.Repo.AddFlashcardSetToFolder(id, folderID)
	if err != nil {
		return nil, err
	}

	return flashcardSet, nil
}

func (s *FlashcardSetService) DeleteFlashcardSetByID(id uint64) error {
	err := s.Repo.DeleteFlashcardSetByID(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *FlashcardSetService) ToggleVisibility(id uint64) error {
	// buisiness logic here
	//
	err := s.Repo.ToggleVisibility(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *FlashcardSetService) RemoveSetFromFolder(setID, folderID uint64) (*models.FlashcardSet, error) {
	//

	flashcardSet, err := s.Repo.RemoveSetFromFolder(setID, folderID)
	if err != nil {
		return nil, err
	}

	return flashcardSet, nil
}

func (s *FlashcardSetService) CheckSetInFolder(setID, folderID uint64) (bool, error) {
	exists, err := s.Repo.CheckSetInFolder(setID, folderID)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func createMapOfFlashcardsIDS(flashcards models.Flashcards) map[int]bool {
	flashcardsMap := make(map[int]bool)
	for _, flashcard := range flashcards {
		if flashcard.ID != 0 {
			flashcardsMap[flashcard.ID] = true
		}
	}
	return flashcardsMap
}
