package service

import (
	"encoding/json"
	"errors"
	"flashcards/internal/models"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TestServiceInterface interface {
	CreateTest(CreateTestRequest) (*models.Test, error)
	ListTests() (models.Tests, error)
	GetTestByID(uint64) (*models.Test, error)
	UpdateTestByID(uint64, map[string]interface{}) (*models.Test, error)
	DeleteTestByID(uint64) error
	GetFlashcard(int) (*models.Flashcard, error)
	GetTestsGroupedByStatus(string) (map[string][]models.Test, error)
	SaveTestResult(string, uint64, map[int]string, int) (*models.TestResult, error)
	AssignTestToUser(string, string) error
	GetTestByToken(string) (*models.Test, error)
	DoesUserHaveAccess(string, uint64) bool
}

type CreateTestRequest struct {
	UserGoogleID string `json:"-"`
	SetIDs       []int  `json:"setIDs"`
	StartDate    string `json:"startDate"`
	DueDate      string `json:"dueDate"`
	NumQuestions int    `json:"NumQuestions"`
}

type TestService struct {
	db *gorm.DB
}

func NewTestService(db *gorm.DB) *TestService {
	return &TestService{db: db}
}

// GetFlashcardsByIDs retrieves flashcards by their IDs
func (s *TestService) GetFlashcard(id int) (*models.Flashcard, error) {
	var flashcard models.Flashcard
	if err := s.db.First(&flashcard, id).Error; err != nil {
		return nil, err
	}
	return &flashcard, nil
}

func (s *TestService) CreateTest(body CreateTestRequest) (*models.Test, error) {
	// Define the date format for parsing
	layout := "2006-01-02"

	// Parse the start date
	startDate, err := time.Parse(layout, body.StartDate)
	if err != nil {
		return nil, err
	}

	// Parse the due date
	dueDate, err := time.Parse(layout, body.DueDate)
	if err != nil {
		return nil, err
	}

	// Fetch the sets from the database based on the provided SetIDs
	var sets []models.FlashcardSet
	if err := s.db.Where("id IN ?", body.SetIDs).Find(&sets).Error; err != nil {
		return nil, err
	}

	// Check if the fetched sets match the requested SetIDs
	if len(sets) != len(body.SetIDs) {
		return nil, err
	}

	// Create the Test model
	test := &models.Test{
		UserGoogleID: body.UserGoogleID,
		StartDate:    startDate,
		DueDate:      dueDate,
		NumQuestions: body.NumQuestions,
		Sets:         sets, // Attach the fetched sets
		AccessToken:  uuid.NewString(),
	}

	testURL := fmt.Sprintf("https://myapp.com/tests/testToken?token=%s", test.AccessToken)
	fmt.Println(testURL)

	// Save the test with associations
	if err := s.db.Create(test).Error; err != nil {
		return nil, err
	}

	return test, nil
}

func (s *TestService) AssignTestToUser(userID string, token string) error {
	// Find the test by its access token
	var test models.Test
	err := s.db.Where("access_token = ?", token).First(&test).Error
	if err != nil {
		return errors.New("test not found")
	}

	// Check if the user already has access
	var testUser models.TestUser
	err = s.db.Where("test_id = ? AND user_google_id = ?", test.ID, userID).First(&testUser).Error
	if err == nil {
		return nil // User already has access
	}

	// If not, create the relationship
	testUser = models.TestUser{
		TestID:       test.ID,
		UserGoogleID: userID,
		AccessToken:  token,
		AssignedAt:   time.Now(),
	}

	if err := s.db.Create(&testUser).Error; err != nil {
		return err
	}

	return nil
}

func (s *TestService) GetTestsGroupedByStatus(userID string) (map[string][]models.Test, error) {
	var finishedTests []models.Test
	var notFinishedTests []models.Test
	var yours []models.Test

	notTakenQuery := s.db.Table("tests").
		Select("tests.*").
		Joins("LEFT JOIN test_results ON tests.id = test_results.test_id").
		Joins("LEFT JOIN test_users ON tests.id = test_users.test_id").
		Where("test_users.user_google_id = ?", userID).                              // Only include tests that the user is assigned to
		Where("test_results.test_id IS NULL OR test_results.is_finished = ?", false) // Include tests that are not finished or have no results
	if err := notTakenQuery.Find(&notFinishedTests).Error; err != nil {
		return nil, err
	}
	// Query for finished tests
	finishedQuery := s.db.Table("tests").
		Select("tests.*").
		Joins("INNER JOIN test_results ON tests.id = test_results.test_id").
		Where("test_results.user_google_id = ? AND test_results.is_finished = ?", userID, true)
	if err := finishedQuery.Find(&finishedTests).Error; err != nil {
		return nil, err
	}

	authorQuery := s.db.Preload("AssignedUsers").
		Where("tests.user_google_id = ?", userID)
	if err := authorQuery.Find(&yours).Error; err != nil {
		return nil, err
	}
	// Group the results
	return map[string][]models.Test{
		"finished":     finishedTests,
		"not_finished": notFinishedTests,
		"yours":        yours,
	}, nil
}

func (s *TestService) ListTests() (models.Tests, error) {
	var tests models.Tests
	if err := s.db.Preload("Flashcards").Preload(flashcard_sets).Preload(folders).Find(&tests).Error; err != nil {
		return nil, err
	}
	return tests, nil
}

func (s *TestService) GetTestByID(id uint64) (*models.Test, error) {
	var test models.Test
	if err := s.db.Preload("Sets").Preload("Sets.Flashcards").First(&test, id).Error; err != nil {
		return nil, err
	}
	return &test, nil
}

func (s *TestService) UpdateTestByID(id uint64, updateData map[string]interface{}) (*models.Test, error) {
	test, err := s.GetTestByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(test).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return test, nil
}

func (s *TestService) DeleteTestByID(id uint64) error {
	if err := s.db.Delete(&models.Test{}, id).Error; err != nil {
		return err
	}

	if err := s.db.Where("test_id = ?", id).Delete(&models.TestUser{}).Error; err != nil {
		return err
	}

	return nil
}

func (s *TestService) SaveTestResult(userID string, testID uint64, answers map[int]string, score int) (*models.TestResult, error) {
	// Marshal the answers map to JSON
	answersJSON, err := json.Marshal(answers)
	if err != nil {
		return nil, err
	}

	// Create a new result object
	result := models.TestResult{
		TestID:       testID,
		UserGoogleID: userID,
		Answers:      answersJSON,
		Score:        score,
		Submitted:    time.Now(),
		IsFinished:   true,
	}

	// Check if a result already exists
	var existingResult models.TestResult
	err = s.db.Where("user_google_id = ? AND test_id = ?", userID, testID).First(&existingResult).Error

	if err == gorm.ErrRecordNotFound {
		// Record doesn't exist, create a new one
		if err := s.db.Create(&result).Error; err != nil {
			return nil, err
		}
	} else if err == nil {
		if err := s.db.Model(&existingResult).Where("id = ?", existingResult.ID).Updates(result).Error; err != nil {
			return nil, err
		}
	} else {
		return nil, err
	}

	return &result, nil
}

func (s *TestService) GetTestByToken(token string) (*models.Test, error) {
	// Find the test by its access token
	var test models.Test
	err := s.db.Where("access_token = ?", token).First(&test).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("test not found")
		}
		return nil, err
	}

	return &test, nil
}

func (s *TestService) DoesUserHaveAccess(userID string, testID uint64) bool {
	test, err := s.GetTestByID(testID)
	if err != nil {
		return false
	}
	if test.UserGoogleID == userID {
		return true
	}
	var testUser models.TestUser
	if err := s.db.Where("test_id = ? AND user_google_id = ?", testID, userID).First(&testUser).Error; err != nil {
		return false
	}
	return true
}
