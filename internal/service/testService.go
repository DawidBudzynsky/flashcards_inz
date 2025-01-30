package service

import (
	"errors"
	"flashcards/internal/models"
	"flashcards/internal/repositories"
	"flashcards/internal/util"
	"fmt"
	"time"

	"golang.org/x/exp/rand"
)

type TestService struct {
	repo repositories.TestRepoInterface
}

func NewTestService(repo repositories.TestRepoInterface) *TestService {
	return &TestService{repo: repo}
}

// GetFlashcardsByIDs retrieves flashcards by their IDs
func (s *TestService) GetFlashcard(id int) (*models.Flashcard, error) {
	flashcard, err := s.repo.GetFlashcard(id)
	if err != nil {
		return nil, err
	}
	return flashcard, nil
}

func (s *TestService) CreateTest(body repositories.CreateTestRequest) (*models.Test, error) {
	test, err := s.repo.CreateTest(body)
	if err != nil {
		return nil, err
	}

	return test, nil
}

func (s *TestService) AssignTestToUser(userID string, token string) error {
	if err := s.repo.AssignTestToUser(userID, token); err != nil {
		return err
	}

	return nil
}

func (s *TestService) GetTestsGroupedByStatus(userID string) (map[string][]models.Test, error) {
	grouped_tests, err := s.repo.GetTestsGroupedByStatus(userID)
	if err != nil {
		return nil, err
	}
	return grouped_tests, nil
}

func (s *TestService) ListTests() (models.Tests, error) {
	tests, err := s.repo.ListTests()
	if err != nil {
		return nil, err
	}

	return tests, nil
}

func (s *TestService) GetTestByID(id uint64) (*models.Test, error) {
	test, err := s.repo.GetTestByID(id)
	if err != nil {
		return nil, err
	}

	return test, nil
}

func (s *TestService) UpdateTestByID(id uint64, updateData map[string]interface{}) (*models.Test, error) {
	test, err := s.repo.UpdateTestByID(id, updateData)
	if err != nil {
		return nil, err
	}
	return test, nil
}

func (s *TestService) DeleteTestByID(id uint64) error {
	if err := s.repo.DeleteTestByID(id); err != nil {
		return err
	}

	return nil
}

func (s *TestService) SaveTestResult(userID string, testID uint64, answers map[int]string, score int) (*models.TestResult, error) {
	result, err := s.repo.SaveTestResult(userID, testID, answers, score)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (s *TestService) GetTestByToken(token string) (*models.Test, error) {
	test, err := s.repo.GetTestByToken(token)
	if err != nil {
		return nil, err
	}

	return test, nil
}

func (s *TestService) DoesUserHaveAccess(userID string, testID uint64) bool {
	hasAccess := s.repo.DoesUserHaveAccess(userID, testID)
	return hasAccess
}

func (s *TestService) GetUserResults(userGoogleID string, testID uint64) (*models.TestResult, error) {
	result, err := s.repo.GetUserResults(userGoogleID, testID)
	if err != nil {
		return nil, err
	}
	return result, nil
}

type Question struct {
	FlashcardID     int      `json:"id"`
	QuestionText    string   `json:"question_text"`
	PossibleAnswers []string `json:"possible_answers"`
}

func (s *TestService) CreateQuestions(test *models.Test) ([]Question, error) {
	pickedFlashcards, err := s.PickFlashcards(test.Sets, test.NumQuestions)
	if err != nil {
		return nil, err
	}

	var questions []Question
	for _, flashcard := range pickedFlashcards {
		possibleAnswers, err := s.CreateAnswers(flashcard, test.Sets)
		if err != nil {
			return nil, err
		}
		questions = append(questions, Question{
			FlashcardID:     flashcard.ID,
			QuestionText:    flashcard.Question,
			PossibleAnswers: possibleAnswers,
		})
	}

	return questions, nil
}

func (s *TestService) PickFlashcards(sets []models.FlashcardSet, numQuestions int) ([]models.Flashcard, error) {
	var selectedFlashcards []models.Flashcard
	var totalFlashcards int

	for _, set := range sets {
		totalFlashcards += len(set.Flashcards)
	}

	if totalFlashcards == 0 {
		return nil, errors.New("no flashcards available in the provided sets")
	}

	questionsPerSet := make([]int, len(sets))
	remainder := numQuestions

	for i, set := range sets {
		if len(set.Flashcards) == 0 {
			questionsPerSet[i] = 0
			continue
		}
		questionsPerSet[i] = int(float64(numQuestions) * (float64(len(set.Flashcards)) / float64(totalFlashcards)))
		remainder -= questionsPerSet[i]
	}

	for i, set := range sets {
		if len(set.Flashcards) > 0 && questionsPerSet[i] == 0 {
			questionsPerSet[i] = 1
			remainder--
		}
	}

	for remainder > 0 {
		for i, set := range sets {
			if remainder == 0 {
				break
			}
			if len(set.Flashcards) > questionsPerSet[i] {
				questionsPerSet[i]++
				remainder--
			}
		}
	}

	rand.Seed(uint64(time.Now().UnixNano()))
	for i, set := range sets {
		if questionsPerSet[i] > len(set.Flashcards) {
			return nil, errors.New("not enough flashcards in a set to meet the requested number")
		}

		rand.Shuffle(len(set.Flashcards), func(i, j int) {
			set.Flashcards[i], set.Flashcards[j] = set.Flashcards[j], set.Flashcards[i]
		})

		selectedFlashcards = append(selectedFlashcards, set.Flashcards[:questionsPerSet[i]]...)
	}

	if len(selectedFlashcards) != numQuestions {
		return nil, fmt.Errorf("unable to select the exact number of flashcards: selected %d, requested %d", len(selectedFlashcards), numQuestions)
	}

	return selectedFlashcards, nil
}

func (s *TestService) CreateAnswers(flashcard models.Flashcard, sets []models.FlashcardSet) ([]string, error) {
	var possibleAnswers []string
	for _, set := range sets {
		for _, card := range set.Flashcards {
			if card.ID != flashcard.ID && card.Answer != flashcard.Answer {
				possibleAnswers = append(possibleAnswers, card.Answer)
			}
		}
	}

	uniqueAnswers := util.SliceToSet(possibleAnswers)

	if len(uniqueAnswers) < 3 {
		return nil, errors.New("not enough incorrect answers without duplicates")
	}
	rand.Seed(uint64(time.Now().UnixNano()))
	rand.Shuffle(len(possibleAnswers), func(i, j int) {
		possibleAnswers[i], possibleAnswers[j] = possibleAnswers[j], possibleAnswers[i]
	})
	incorrectAnswers := possibleAnswers[:3]
	allAnswers := append(incorrectAnswers, flashcard.Answer)
	rand.Shuffle(len(allAnswers), func(i, j int) {
		allAnswers[i], allAnswers[j] = allAnswers[j], allAnswers[i]
	})

	return allAnswers, nil
}
