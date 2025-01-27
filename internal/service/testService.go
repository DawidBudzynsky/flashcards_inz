package service

import (
	"flashcards/internal/models"
	"flashcards/internal/repositories"
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
