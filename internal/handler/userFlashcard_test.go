package handler

import (
	"encoding/json"
	"flashcards/internal/models"
	"testing"
	"time"
)

type Item struct {
	CardId                    int
	Easiness                  float64
	ConsecutiveCorrectAnswers int
	Due                       time.Time
}

func TestDecode(t *testing.T) {
	item := Item{
		CardId:                    123,
		Easiness:                  2.7,
		ConsecutiveCorrectAnswers: 5,
		Due:                       time.Now().Add(24 * time.Hour),
	}

	encodedItem, err := json.Marshal(item)
	if err != nil {
		t.Fatalf("Failed to marshal item: %v", err)
	}

	decoded, err := decode(encodedItem)
	if err != nil {
		t.Fatalf("decode returned an error: %v", err)
	}

	expected := models.UserFlashcard{
		FlashcardID:               item.CardId,
		Easiness:                  item.Easiness,
		ConsecutiveCorrectAnswers: item.ConsecutiveCorrectAnswers,
		NextReviewDue:             item.Due,
	}

	// Verify the decoded result
	if decoded.FlashcardID != expected.FlashcardID {
		t.Errorf("FlashcardID mismatch. Got %v, expected %v", decoded.FlashcardID, expected.FlashcardID)
	}
	if decoded.Easiness != expected.Easiness {
		t.Errorf("Easiness mismatch. Got %v, expected %v", decoded.Easiness, expected.Easiness)
	}
	if decoded.ConsecutiveCorrectAnswers != expected.ConsecutiveCorrectAnswers {
		t.Errorf("ConsecutiveCorrectAnswers mismatch. Got %v, expected %v", decoded.ConsecutiveCorrectAnswers, expected.ConsecutiveCorrectAnswers)
	}
	if !decoded.NextReviewDue.Equal(expected.NextReviewDue) {
		t.Errorf("NextReviewDue mismatch. Got %v, expected %v", decoded.NextReviewDue, expected.NextReviewDue)
	}
}
