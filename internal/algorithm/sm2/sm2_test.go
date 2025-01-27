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
				NextReviewDue:             now.AddDate(0, 0, 1),
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
				NextReviewDue:             now.AddDate(0, 0, 1),
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
				t.Errorf("expected Due %v, got %v", tt.expected.NextReviewDue, item.NextReviewDue)
			}
		})
	}
}

func TestUpdateWithHighConsecutiveAnswers(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name     string
		oldItem  Item
		review   review.ReviewItem
		expected Item
	}{
		{
			name: "Review with 10 consecutive correct answers, quality CorrectEasy",
			oldItem: Item{
				FlashcardID:               1,
				Easiness:                  2.5,
				ConsecutiveCorrectAnswers: 4,
				NextReviewDue:             now.AddDate(0, 0, 1),
			},
			review: review.ReviewItem{
				CardId:  1,
				Quality: review.CorrectEasy,
			},
			expected: Item{
				FlashcardID:               1,
				Easiness:                  calculateEasiness(2.5, quality(review.CorrectEasy)),
				ConsecutiveCorrectAnswers: 5,
				NextReviewDue:             now.AddDate(0, 0, int(math.Round(float64(DueDateStartDays)*math.Pow(2.5, 3)))),
			},
		},
		{
			name: "Review with 10 consecutive correct answers, quality Incorrect",
			oldItem: Item{
				FlashcardID:               2,
				Easiness:                  2.5,
				ConsecutiveCorrectAnswers: 10,
				NextReviewDue:             now.AddDate(0, 0, 1),
			},
			review: review.ReviewItem{
				CardId:  2,
				Quality: review.IncorrectBlackout,
			},
			expected: Item{
				FlashcardID:               2,
				Easiness:                  calculateEasiness(2.5, quality(review.IncorrectBlackout)),
				ConsecutiveCorrectAnswers: 0,
				NextReviewDue:             now.AddDate(0, 0, 1),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			item := update(tt.oldItem, tt.review, now)

			if item.FlashcardID != tt.expected.FlashcardID {
				t.Errorf("expected CardId %d, got %d", tt.expected.FlashcardID, item.FlashcardID)
			}

			if math.Abs(item.Easiness-tt.expected.Easiness) > 1e-6 {
				t.Errorf("expected Easiness %.6f, got %.6f", tt.expected.Easiness, item.Easiness)
			}

			if item.ConsecutiveCorrectAnswers != tt.expected.ConsecutiveCorrectAnswers {
				t.Errorf("expected ConsecutiveCorrectAnswers %d, got %d", tt.expected.ConsecutiveCorrectAnswers, item.ConsecutiveCorrectAnswers)
			}

			if !item.NextReviewDue.Equal(tt.expected.NextReviewDue) {
				t.Errorf("expected Due %v, got %v", tt.expected.NextReviewDue, item.NextReviewDue)
			}
		})
	}
}
