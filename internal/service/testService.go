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
}

type CreateTestRequest struct {
	UserGoogleID   string    `json:"-"`
	SetID          int       `json:"set_id"`
	StartTime      time.Time `json:"start_time"`
	EndTime        time.Time `json:"end_time"`
	TotalQuestions int       `json:"total_questions"`
}

type TestService struct {
	db *gorm.DB
}

func NewTestService(db *gorm.DB) *TestService {
	return &TestService{db: db}
}

func (s *TestService) CreateTest(body CreateTestRequest) (*models.Test, error) {
	test := &models.Test{
		UserGoogleID:   body.UserGoogleID,
		SetID:          body.SetID,
		StartTime:      body.StartTime,
		EndTime:        body.EndTime,
		TotalQuestions: body.TotalQuestions,
	}
	if err := s.db.Create(test).Error; err != nil {
		return nil, err
	}
	return test, nil
}

func (s *TestService) ListTests() (models.Tests, error) {
	var tests models.Tests
	if err := s.db.Preload(flashcard_sets).Preload(folders).Find(&tests).Error; err != nil {
		return nil, err
	}
	return tests, nil
}

func (s *TestService) GetTestByID(id uint64) (*models.Test, error) {
	var test models.Test
	if err := s.db.Preload(flashcard_sets).Preload(folders).First(&test, id).Error; err != nil {
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
