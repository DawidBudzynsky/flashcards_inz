package service

import (
	"flashcards/internal/models"
	"time"

	"gorm.io/gorm"
)

type TestServiceInterface interface {
	CreateTest(CreateTestRequest) (*models.Test, error)
	ListTests() (models.Tests, error)
	GetTestByID(uint64) (*models.Test, error)
	UpdateTestByID(uint64, map[string]interface{}) (*models.Test, error)
	DeleteTestByID(uint64) error
	GetFlashcard(int) (*models.Flashcard, error)
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
	}

	// Save the test with associations
	if err := s.db.Create(test).Error; err != nil {
		return nil, err
	}

	return test, nil
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
	return nil
}
