package service_test

import (
	"flashcards/internal/models"
	"flashcards/internal/service"
	"flashcards/internal/util"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateQuestions(t *testing.T) {
	setA := models.FlashcardSet{
		ID: 1,
		Flashcards: []models.Flashcard{
			{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			{ID: 2, FlashcardSetID: 1, Question: "What is 2 + 2?", Answer: "4"},
			{ID: 3, FlashcardSetID: 1, Question: "What is 3 + 3?", Answer: "6"},
			{ID: 4, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "8"},
			{ID: 5, FlashcardSetID: 1, Question: "What is 5 + 5?", Answer: "10"},
			{ID: 6, FlashcardSetID: 1, Question: "What is 6 + 6?", Answer: "12"},
			{ID: 7, FlashcardSetID: 1, Question: "What is 7 + 7?", Answer: "14"},
			{ID: 8, FlashcardSetID: 1, Question: "What is 8 + 8?", Answer: "16"},
			{ID: 9, FlashcardSetID: 1, Question: "What is 9 + 9?", Answer: "18"},
			{ID: 10, FlashcardSetID: 1, Question: "What is 10 + 10?", Answer: "20"},
		},
	}

	setB := models.FlashcardSet{
		ID: 2,
		Flashcards: []models.Flashcard{
			{ID: 11, FlashcardSetID: 2, Question: "What is 1 - 1?", Answer: "0"},
			{ID: 12, FlashcardSetID: 2, Question: "What is 2 - 2?", Answer: "0"},
			{ID: 13, FlashcardSetID: 2, Question: "What is 3 - 3?", Answer: "0"},
			{ID: 14, FlashcardSetID: 2, Question: "What is 4 - 4?", Answer: "0"},
			{ID: 15, FlashcardSetID: 2, Question: "What is 5 - 5?", Answer: "0"},
			{ID: 16, FlashcardSetID: 2, Question: "What is 6 - 6?", Answer: "0"},
			{ID: 17, FlashcardSetID: 2, Question: "What is 7 - 7?", Answer: "0"},
			{ID: 18, FlashcardSetID: 2, Question: "What is 8 - 8?", Answer: "0"},
			{ID: 19, FlashcardSetID: 2, Question: "What is 9 - 9?", Answer: "0"},
			{ID: 20, FlashcardSetID: 2, Question: "What is 10 - 10?", Answer: "0"},
		},
	}

	setC := models.FlashcardSet{
		ID: 3,
		Flashcards: []models.Flashcard{
			{ID: 21, FlashcardSetID: 3, Question: "What is 0 + 1?", Answer: "1"},
		},
	}

	setD := models.FlashcardSet{
		ID: 4,
		Flashcards: []models.Flashcard{
			{ID: 22, FlashcardSetID: 4, Question: "What is 1 + 0?", Answer: "1"},
			{ID: 23, FlashcardSetID: 4, Question: "What is 2 + 0?", Answer: "2"},
		},
	}

	tests := []struct {
		name           string
		sets           []models.FlashcardSet
		numQuestions   int
		expectedCounts map[int]int
	}{
		{
			name:         "Test case 1: 4 questions from multiple sets",
			sets:         []models.FlashcardSet{setA, setB, setC, setD},
			numQuestions: 4,
			expectedCounts: map[int]int{
				0: 1,
				1: 1,
				2: 1,
				3: 1,
			},
		},
		{
			name:         "Test case 2: 10 questions from two sets each 10 questions",
			sets:         []models.FlashcardSet{setA, setB},
			numQuestions: 10,
			expectedCounts: map[int]int{
				0: 5,
				1: 5,
			},
		},
		{
			name:         "Test case 3: 7 questions from two sets, 1st - 10 questions, 2nd - 1 question",
			sets:         []models.FlashcardSet{setA, setC},
			numQuestions: 7,
			expectedCounts: map[int]int{
				0: 6,
				1: 1,
			},
		},
		{
			name:         "Test case 3: 7 questions from two sets, 1st - 10 questions, 2nd - 1 question",
			sets:         []models.FlashcardSet{setA, setC},
			numQuestions: 7,
			expectedCounts: map[int]int{
				0: 6,
				1: 1,
			},
		},
	}

	handler := &service.TestService{}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			test := models.Test{
				Sets:         tt.sets,
				NumQuestions: tt.numQuestions,
			}

			questions, err := handler.CreateQuestions(&test)

			assert.NoError(t, err)
			assert.Equal(t, len(questions), tt.numQuestions)

			actualCounts := make(map[int]int)

			for _, q := range questions {
				for setIndex, set := range tt.sets {
					for _, card := range set.Flashcards {
						if card.ID == q.FlashcardID {
							actualCounts[setIndex]++
						}
					}
				}
			}

			for setIndex, expectedCount := range tt.expectedCounts {
				assert.Equal(t, expectedCount, actualCounts[setIndex], "Set %d has the wrong number of questions", setIndex)
			}
		})
	}
}

func TestCreateAnswers_NoDuplicateCorrectAnswer(t *testing.T) {
	setA := models.FlashcardSet{
		ID: 1,
		Flashcards: []models.Flashcard{
			{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			{ID: 2, FlashcardSetID: 1, Question: "What is 2 + 2?", Answer: "4"},
			{ID: 3, FlashcardSetID: 1, Question: "What is 3 + 3?", Answer: "6"},
			{ID: 4, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "8"},
		},
	}

	handler := &service.TestService{}
	flashcard := models.Flashcard{
		ID:       1,
		Question: "question",
		Answer:   "2",
	}

	t.Run(flashcard.Question, func(t *testing.T) {
		possibleAnswers, err := handler.CreateAnswers(flashcard, []models.FlashcardSet{setA})
		assert.NoError(t, err)

		var incorrectAnswers []string
		var correctAnswer string
		for _, answer := range possibleAnswers {
			if answer == flashcard.Answer {
				correctAnswer = answer
			} else {
				incorrectAnswers = append(incorrectAnswers, answer)
			}
		}

		assert.NotContains(t, incorrectAnswers, correctAnswer, "Incorrect answers should not contain the correct answer")
	})
}

func TestCreateAnswers_InsufficientIncorrectAnswers(t *testing.T) {
	setA := models.FlashcardSet{
		ID: 1,
		Flashcards: []models.Flashcard{
			{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			{ID: 2, FlashcardSetID: 1, Question: "What is 2 + 2?", Answer: "4"},
			{ID: 3, FlashcardSetID: 1, Question: "What is 3 + 3?", Answer: "4"},
			{ID: 4, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "8"},
			{ID: 5, FlashcardSetID: 1, Question: "What is 5 + 5?", Answer: "8"},
		},
	}

	flashcard := models.Flashcard{
		ID:       1,
		Question: "What is 1 + 1?",
		Answer:   "2",
	}

	service := &service.TestService{}

	t.Run(flashcard.Question, func(t *testing.T) {
		possibleAnswers, err := service.CreateAnswers(flashcard, []models.FlashcardSet{setA})

		assert.Error(t, err)
		assert.Equal(t, "not enough incorrect answers without duplicates", err.Error(), "Expected error message for insufficient incorrect answers")

		assert.Nil(t, possibleAnswers, "Expected possibleAnswers to be nil when not enough incorrect answers are available")
	})
}

func TestCreateAnswersNoDuplicates(t *testing.T) {
	setA := models.FlashcardSet{
		ID: 1,
		Flashcards: []models.Flashcard{
			{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			{ID: 2, FlashcardSetID: 1, Question: "What is 2 + 2?", Answer: "4"},
			{ID: 3, FlashcardSetID: 1, Question: "What is 3 + 3?", Answer: "6"},
			{ID: 4, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "8"},
			{ID: 5, FlashcardSetID: 1, Question: "What is 5 + 5?", Answer: "10"},
			{ID: 6, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
		},
	}

	setB := models.FlashcardSet{
		ID: 1,
		Flashcards: []models.Flashcard{
			{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			{ID: 2, FlashcardSetID: 1, Question: "What is 2 + 2?", Answer: "2"},
			{ID: 3, FlashcardSetID: 1, Question: "What is 3 + 3?", Answer: "2"},
			{ID: 4, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "3"},
			{ID: 5, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "3"},
			{ID: 6, FlashcardSetID: 1, Question: "What is 4 + 4?", Answer: "3"},
			{ID: 7, FlashcardSetID: 1, Question: "What is 5 + 5?", Answer: "4"},
			{ID: 8, FlashcardSetID: 1, Question: "What is 5 + 5?", Answer: "4"},
			{ID: 9, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "5"},
			{ID: 10, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "5"},
			{ID: 11, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "5"},
		},
	}

	handler := &service.TestService{}

	tests := []struct {
		name      string
		flashcard models.Flashcard
		sets      []models.FlashcardSet
	}{
		{
			name:      "Test for no duplicates in possible answers",
			flashcard: models.Flashcard{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			sets:      []models.FlashcardSet{setB},
		},
		{
			name:      "Test for no duplicates in possible answers",
			flashcard: models.Flashcard{ID: 1, FlashcardSetID: 1, Question: "What is 1 + 1?", Answer: "2"},
			sets:      []models.FlashcardSet{setA},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			possibleAnswers, err := handler.CreateAnswers(tt.flashcard, tt.sets)

			assert.NoError(t, err)
			assert.Equal(t, 4, len(possibleAnswers), "Wrong lenght of possible answers")

			uniqueAnswers := util.SliceToSet(possibleAnswers)
			assert.Equal(t, len(uniqueAnswers), len(possibleAnswers), "Possible answers should not contain duplicates")
		})
	}
}

func TestSliceToSet(t *testing.T) {
	tests := []struct {
		name     string
		input    []string
		expected []string
	}{
		{
			name:     "Test with duplicates",
			input:    []string{"apple", "banana", "apple", "orange", "banana"},
			expected: []string{"apple", "banana", "orange"},
		},
		{
			name:     "Test with no duplicates",
			input:    []string{"apple", "banana", "orange"},
			expected: []string{"apple", "banana", "orange"},
		},
		{
			name:     "Test with empty slice",
			input:    []string{},
			expected: []string(nil),
		},
		{
			name:     "Test with single element",
			input:    []string{"apple"},
			expected: []string{"apple"},
		},
		{
			name:     "Test with all identical elements",
			input:    []string{"apple", "apple", "apple"},
			expected: []string{"apple"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual := util.SliceToSet(tt.input)
			assert.Equal(t, tt.expected, actual, "For input %v, expected %v but got %v", tt.input, tt.expected, actual)
		})
	}
}
