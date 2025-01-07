package sm2

import (
	"flashcards/internal/algorithm/review"
	"math"
	"testing"
	"time"
)

func TestCreate(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name     string
		review   review.ReviewItem
		expected Item
	}{
		{
			name: "First review with a valid quality",
			review: review.ReviewItem{
				CardId:  1,
				Quality: review.CorrectEasy,
			},
			expected: Item{
				FlashcardID:               1,
				Easiness:                  2.5 + EasinessConst + (EasinessLineal * 5) + (EasinessQuadratic * math.Pow(5, 2)),
				ConsecutiveCorrectAnswers: 1,
				NextReviewDue:             now.AddDate(0, 0, 1).Unix(),
			},
		},
		{
			name: "First review with NoReview",
			review: review.ReviewItem{
				CardId:  2,
				Quality: review.NoReview,
			},
			expected: Item{
				FlashcardID:               2,
				Easiness:                  DefaultEasiness,
				ConsecutiveCorrectAnswers: 0,
				NextReviewDue:             now.AddDate(0, 0, 1).Unix(),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			item := create(tt.review, now)

			if item.FlashcardID != tt.expected.FlashcardID {
				t.Errorf("expected CardId %d, got %d", tt.expected.FlashcardID, item.FlashcardID)
			}

			if math.Abs(item.Easiness-tt.expected.Easiness) > 1e-6 {
				t.Errorf("expected Easiness %.6f, got %.6f", tt.expected.Easiness, item.Easiness)
			}

			if item.ConsecutiveCorrectAnswers != tt.expected.ConsecutiveCorrectAnswers {
				t.Errorf("expected ConsecutiveCorrectAnswers %d, got %d", tt.expected.ConsecutiveCorrectAnswers, item.ConsecutiveCorrectAnswers)
			}

			if item.NextReviewDue != tt.expected.NextReviewDue {
				t.Errorf("expected Due %d, got %d", tt.expected.NextReviewDue, item.NextReviewDue)
			}
		})
	}
}
