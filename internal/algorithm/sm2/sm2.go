package sm2

import (
	"encoding/json"
	"flashcards/internal/algorithm/review"
	"math"
	"time"
)

const (
	DefaultEasiness = 2.5
	MinEasiness     = 1.3

	EasinessConst     = -0.8
	EasinessLineal    = 0.28
	EasinessQuadratic = 0.02

	DueDateStartDays   = 6
	IncorrectThreshold = 3.0
)

var easinessFormula = func(oldEasiness, quality float64) float64 {
	return oldEasiness + EasinessConst + (EasinessLineal * quality) + (EasinessQuadratic * math.Pow(quality, 2))
}

type Item struct {
	CardId                    int
	Easiness                  float64
	ConsecutiveCorrectAnswers int
	Due                       int64
}

type Sm2 struct {
	now time.Time
}

func NewSm2(now time.Time) *Sm2 {
	return &Sm2{now: now}
}

func (s *Sm2) Update(oldItem []byte, r review.ReviewItem) ([]byte, error) {
	var newItem Item
	if oldItem != nil {
		decodedItem, err := decode(oldItem)
		if err != nil {
			return nil, err
		}

		newItem = update(decodedItem, r, s.now)
	} else {
		newItem = create(r, s.now)
	}

	encodedItem, err := encode(newItem)
	if err != nil {
		return nil, err
	}
	return encodedItem, nil
}

func (s *Sm2) Due(item []byte, t time.Time) (d review.DueItem) {
	decodedItem, err := decode(item)
	if err != nil {
		return d
	}

	if decodedItem.Due < t.Unix() {
		return review.DueItem{
			CardId: decodedItem.CardId,
		}
	}

	return d
}

func update(oldItem Item, r review.ReviewItem, s time.Time) Item {
	newItem := Item{}
	newItem.CardId = r.CardId

	newItem.Easiness = calculateEasiness(oldItem.Easiness, quality(r.Quality))

	if r.Quality < review.CorrectHard {
		newItem.Due = s.AddDate(0, 0, 1).Unix()
		newItem.ConsecutiveCorrectAnswers = 0
	}
	// TODO: take a look on that one
	days := float64(DueDateStartDays) * math.Pow(oldItem.Easiness, float64(oldItem.ConsecutiveCorrectAnswers-1))
	newItem.Due = s.AddDate(0, 0, int(math.Round(days))).Unix()
	newItem.ConsecutiveCorrectAnswers = oldItem.ConsecutiveCorrectAnswers + 1

	return newItem
}

func quality(q int) float64 {
	return float64(q - 1)
}

func create(r review.ReviewItem, now time.Time) Item {
	newItem := Item{}
	newItem.CardId = r.CardId

	if r.Quality != review.NoReview {
		// the first reveiw for a card
		newItem.Easiness = calculateEasiness(DefaultEasiness, quality(r.Quality))
		newItem.ConsecutiveCorrectAnswers = 1
	} else {
		newItem.Easiness = DefaultEasiness
		newItem.ConsecutiveCorrectAnswers = 0
	}

	newItem.Due = now.AddDate(0, 0, 1).Unix()
	return newItem
}

func calculateEasiness(oldEasiness float64, quality float64) float64 {
	newEasiness := easinessFormula(oldEasiness, quality)
	if newEasiness < MinEasiness {
		return MinEasiness
	}
	return newEasiness
}

// deserialize
func decode(encodedItem []byte) (Item, error) {
	res := Item{}
	errJson := json.Unmarshal(encodedItem, &res)
	if errJson != nil {
		return res, errJson
	}

	return res, nil
}

// serialize
func encode(item Item) ([]byte, error) {
	encodedItem, err := json.Marshal(item)
	if err != nil {
		return nil, err
	}

	return encodedItem, nil
}
