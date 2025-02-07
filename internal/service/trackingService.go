package service

import (
	"encoding/json"
	"flashcards/internal/algorithm/review"
	"flashcards/internal/algorithm/sm2"
	"flashcards/internal/models"
	"flashcards/internal/repositories"
	"fmt"
	"time"
)

type TrackingService struct {
	repo repositories.TrackingRepoInterface
}

func NewTrackingService(repository *repositories.TrackingRepo) *TrackingService {
	return &TrackingService{
		repo: repository,
	}
}

func (s *TrackingService) GetFlashcardsForToday(userID string) (*[]models.Flashcard, error) {
	flashcards, err := s.repo.GetFlashcardsForToday(userID)
	if err != nil {
		return nil, err
	}
	return &flashcards, nil
}

func (s *TrackingService) UpdateOrCreateFlashcard(review review.ReviewItem, userID string) (*models.Tracking, error) {
	card, _ := s.repo.GetByCardID(review.CardId)
	cardExists := card != nil

	marshalledCard, err := encode(card) // this can be nil, which is intentional
	if err != nil {
		return nil, err
	}

	// update the card using algorithm
	sm2 := sm2.NewSm2(time.Now())
	cardData, err := sm2.Update(marshalledCard, review)
	if err != nil {
		return nil, err
	}

	newCard, err := s.updateOrcreateFlashcard(cardExists, cardData, userID)
	if err != nil {
		return nil, err
	}
	return newCard, nil
}

func (s *TrackingService) updateOrcreateFlashcard(cardExists bool, data []byte, userID string) (*models.Tracking, error) {
	var newCard *models.Tracking
	if cardExists {
		newCard, err := s.update(data)
		if err != nil {
			return nil, err
		}
		return newCard, nil
	}
	// create a card in database with info
	newCard, err := s.create(data, userID)
	fmt.Println(newCard)
	if err != nil {
		return nil, err
	}

	return newCard, nil
}

func (s *TrackingService) update(card []byte) (*models.Tracking, error) {
	decodedCard, err := decode(card)
	if err != nil {
		return nil, err
	}

	userFlashcard := &models.Tracking{
		Easiness:                  decodedCard.Easiness,
		ConsecutiveCorrectAnswers: decodedCard.ConsecutiveCorrectAnswers,
		LastReviewed:              time.Now(),
		NextReviewDue:             decodedCard.NextReviewDue,
		TotalReviews:              decodedCard.TotalReviews + 1,
	}

	userFlashcard, err = s.repo.UpdateByID(decodedCard.FlashcardID, userFlashcard)
	if err != nil {
		return nil, err
	}
	return userFlashcard, nil
}

func (s *TrackingService) create(card []byte, userGoogleID string) (*models.Tracking, error) {
	decodedCard, err := decode(card)
	if err != nil {
		return nil, err
	}

	userFlashcard := &models.Tracking{
		FlashcardID:               decodedCard.FlashcardID,
		Easiness:                  decodedCard.Easiness,
		ConsecutiveCorrectAnswers: decodedCard.ConsecutiveCorrectAnswers,
		LastReviewed:              time.Now(),
		NextReviewDue:             decodedCard.NextReviewDue,
		TotalReviews:              0,
	}

	userFlashcard, err = s.repo.Create(userFlashcard)
	if err != nil {
		return nil, err
	}

	return userFlashcard, nil
}

// deserialize
func decode(encodedItem []byte) (models.Tracking, error) {
	res := models.Tracking{}
	if err := json.Unmarshal(encodedItem, &res); err != nil {
		return res, err
	}

	return res, nil
}

// serialize
func encode(item *models.Tracking) ([]byte, error) {
	if item == nil {
		return nil, nil
	}
	encodedItem, err := json.Marshal(item)
	if err != nil {
		return nil, err
	}

	return encodedItem, nil
}
