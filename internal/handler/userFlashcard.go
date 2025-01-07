package handler

import (
	"encoding/json"
	"flashcards/internal/algorithm/review"
	"flashcards/internal/algorithm/sm2"
	"flashcards/internal/middlewares"
	"flashcards/internal/models"
	"flashcards/internal/service"
	"net/http"
	"time"
)

type UserFlashcardHandler struct {
	Service service.UserFlashcardService
}

func (u *UserFlashcardHandler) Create(w http.ResponseWriter, r *http.Request) {
	var reviewItem review.ReviewItem
	if err := json.NewDecoder(r.Body).Decode(&reviewItem); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get the card form database, if card doesnt exists its value is nil
	card, _ := u.Service.GetByCardID(reviewItem.CardId)

	// get userGoogleID from context
	userGoogleID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	marshalledCard, err := encode(card)
	if err != nil {
		http.Error(w, "unable to marshall the card from db", http.StatusUnauthorized)
		return
	}

	sm2 := sm2.NewSm2(time.Now())
	updatedCard, err := sm2.Update(marshalledCard, reviewItem)
	if err != nil {
		http.Error(w, "Error in sm2 update", http.StatusInternalServerError)
		return
	}

	var newCard *models.UserFlashcard
	if card != nil {
		// update a card in database with info
		newCard, err = u.update(updatedCard)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		// create a card in database with info
		newCard, err = u.create(updatedCard, userGoogleID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newCard); err != nil {
		http.Error(w, "failed to encode a card", http.StatusInternalServerError)
	}
}

func (u *UserFlashcardHandler) update(card []byte) (*models.UserFlashcard, error) {
	decodedCard, err := decode(card)
	if err != nil {
		return nil, err
	}

	userFlashcard := &models.UserFlashcard{
		Easiness:                  decodedCard.Easiness,
		ConsecutiveCorrectAnswers: decodedCard.ConsecutiveCorrectAnswers,
		LastReviewed:              time.Now(),
		NextReviewDue:             decodedCard.NextReviewDue,
		TotalReviews:              decodedCard.TotalReviews + 1, // increment total reviews
	}

	userFlashcard, err = u.Service.UpdateByID(decodedCard.FlashcardID, userFlashcard)
	if err != nil {
		return nil, err
	}
	return userFlashcard, nil
}

func (u *UserFlashcardHandler) create(card []byte, userGoogleID string) (*models.UserFlashcard, error) {
	decodedCard, err := decode(card)
	if err != nil {
		return nil, err
	}

	userFlashcard := &models.UserFlashcard{
		UserGoogleID:              userGoogleID,
		FlashcardID:               decodedCard.FlashcardID,
		Easiness:                  decodedCard.Easiness,
		ConsecutiveCorrectAnswers: decodedCard.ConsecutiveCorrectAnswers,
		LastReviewed:              time.Now(),
		NextReviewDue:             decodedCard.NextReviewDue,
		TotalReviews:              1, // Default value for new cards is 0, maybe should be 1 here because we reviewed it
	}

	userFlashcard, err = u.Service.Create(userFlashcard)
	if err != nil {
		return nil, err
	}

	return userFlashcard, nil
}

// deserialize
func decode(encodedItem []byte) (models.UserFlashcard, error) {
	res := models.UserFlashcard{}
	if err := json.Unmarshal(encodedItem, &res); err != nil {
		return res, err
	}

	return res, nil
}

// serialize
func encode(item *models.UserFlashcard) ([]byte, error) {
	if item == nil {
		return nil, nil
	}
	encodedItem, err := json.Marshal(item)
	if err != nil {
		return nil, err
	}

	return encodedItem, nil
}

// TODO: maybe create something like userFlashcard2Sm2Item
