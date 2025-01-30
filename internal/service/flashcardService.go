package service

import (
	"bytes"
	"encoding/json"
	"errors"
	"flashcards/internal/models"
	"flashcards/internal/repositories"
	"io"
	"net/http"
	"os"
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
	err := s.Repo.DeleteFlashcardByID(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *FlashcardService) ToggleTracking(id uint64) error {
	flashcard, err := s.Repo.GetFlashcardByID(id)
	if err != nil {
		return err
	}
	if flashcard.Tracking == nil {
		flashcard.Tracking = &models.Tracking{
			Easiness:                  2.5,
			ConsecutiveCorrectAnswers: 0,
			LastReviewed:              time.Now(),
			NextReviewDue:             time.Now(),
			TotalReviews:              0,
		}
	} else {
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

type TranslateRequest struct {
	Q      string `json:"q"`
	Source string `json:"source"`
	Target string `json:"target"`
	Format string `json:"format"`
}

type TranslateResponse struct {
	Data struct {
		Translations []struct {
			TranslatedText string `json:"translatedText"`
		} `json:"translations"`
	} `json:"data"`
}

func (s *FlashcardService) TranslateText(req *TranslateRequest) (*TranslateResponse, error) {
	apiKey := os.Getenv("GOOGLE_TRANSLATE_API_KEY")
	if apiKey == "" {
		return nil, errors.New("API key not found in environment")
	}

	url := "https://translation.googleapis.com/language/translate/v2?key=" + apiKey
	body, _ := json.Marshal(req)

	// make erquest to translation service
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("Response status code wrong")
	}

	var translateResp *TranslateResponse
	err = json.Unmarshal(responseBody, &translateResp)
	if err != nil {
		return nil, err
	}

	return translateResp, nil
}
