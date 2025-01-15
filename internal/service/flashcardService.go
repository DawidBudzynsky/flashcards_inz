package service

import (
	"flashcards/internal/models"
	"flashcards/internal/repositories"
	"time"
)

type FlashcardService struct {
	Repo repositories.FlashcardRepoInterface
}

func NewFlashcardService(repository *repositories.FlashcardRepo) *FlashcardService {
	return &FlashcardService{
		Repo: repository,
	}
}

func (s *FlashcardService) CreateFlashcard(flashcard repositories.CreateFlashcardRequest) (*models.Flashcard, error) {
	// buisiness logic here
	//
	newFlashcard, err := s.Repo.CreateFlashcard(flashcard)
	if err != nil {
		return nil, err
	}
	return newFlashcard, nil
}

func (s *FlashcardService) ListFlashcards() (models.Flashcards, error) {
	// buisiness logic here
	//
	flashcards, err := s.Repo.ListFlashcards()
	if err != nil {
		return nil, err
	}
	return flashcards, nil
}

func (s *FlashcardService) GetFlashcardByID(id uint64) (*models.Flashcard, error) {
	// buisiness logic here
	//
	flashcard, err := s.Repo.GetFlashcardByID(id)
	if err != nil {
		return nil, err
	}
	return flashcard, nil
}

func (s *FlashcardService) UpdateFlashcardByID(id uint64, updateData repositories.UpdateFlashcardRequest) (*models.Flashcard, error) {
	// buisiness logic here
	//
	updatedCard, err := s.Repo.UpdateFlashcardByID(id, updateData)
	if err != nil {
		return nil, err
	}
	return updatedCard, nil
}

func (s *FlashcardService) DeleteFlashcardByID(id int) error {
	// buisiness logic here
	//
	err := s.Repo.DeleteFlashcardByID(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *FlashcardService) ToggleTracking(id uint64) error {
	// buisiness logic here
	//
	flashcard, err := s.Repo.GetFlashcardByID(id)
	if err != nil {
		return err
	}
	if flashcard.Tracking == nil {
		// Enable tracking by creating a new Tracking instance
		flashcard.Tracking = &models.Tracking{
			Easiness:                  2.5,
			ConsecutiveCorrectAnswers: 0,
			LastReviewed:              time.Now(),
			NextReviewDue:             time.Now(),
			TotalReviews:              0,
		}
	} else {
		// Disable tracking by deleting the Tracking record
		if err := s.Repo.DeleteTrackingByFlashcardID(flashcard.ID); err != nil {
			return err
		}
		flashcard.Tracking = nil
	}

	if err := s.Repo.Save(flashcard); err != nil {
		return err
	}
	return nil
}
