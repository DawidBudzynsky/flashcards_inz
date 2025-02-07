package service_test

import (
	"flashcards/internal/models"
	"flashcards/internal/repositories"

	"github.com/stretchr/testify/mock"
)

type MockFlashcardSetRepo struct {
	mock.Mock
}

func (m *MockFlashcardSetRepo) CreateFlashcardSet(req repositories.CreateFlashcardSetRequest) (*models.FlashcardSet, error) {
	args := m.Called(req)
	return args.Get(0).(*models.FlashcardSet), args.Error(1)
}

func (m *MockFlashcardSetRepo) ListFlashcardSets() (models.FlashcardsSets, error) {
	args := m.Called()
	return args.Get(0).(models.FlashcardsSets), args.Error(1)
}

func (m *MockFlashcardSetRepo) ListFlashcardSetsForUser(userID string) (models.FlashcardsSets, error) {
	args := m.Called(userID)
	return args.Get(0).(models.FlashcardsSets), args.Error(1)
}

func (m *MockFlashcardSetRepo) GetFlashcardSetByID(id uint64) (*models.FlashcardSet, error) {
	args := m.Called(id)
	return args.Get(0).(*models.FlashcardSet), args.Error(1)
}

func (m *MockFlashcardSetRepo) UpdateFlashcardSetByID(id uint64, set *models.FlashcardSet) (*models.FlashcardSet, error) {
	args := m.Called(id, set)
	return args.Get(0).(*models.FlashcardSet), args.Error(1)
}

func (m *MockFlashcardSetRepo) DeleteFlashcardSetByID(id uint64) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockFlashcardSetRepo) ToggleVisibility(id uint64) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockFlashcardSetRepo) AddFlashcardSetToFolder(setID, folderID uint64) (*models.FlashcardSet, error) {
	args := m.Called(setID, folderID)
	return args.Get(0).(*models.FlashcardSet), args.Error(1)
}

func (m *MockFlashcardSetRepo) RemoveSetFromFolder(setID, folderID uint64) (*models.FlashcardSet, error) {
	args := m.Called(setID, folderID)
	return args.Get(0).(*models.FlashcardSet), args.Error(1)
}

func (m *MockFlashcardSetRepo) CheckSetInFolder(setID, folderID uint64) (bool, error) {
	args := m.Called(setID, folderID)
	return args.Bool(0), args.Error(1)
}

// Mock flashcardService
type MockFlashcardService struct {
	mock.Mock
}

func (m *MockFlashcardService) CreateFlashcard(req repositories.CreateFlashcardRequest) (*models.Flashcard, error) {
	args := m.Called(req)
	return args.Get(0).(*models.Flashcard), args.Error(1)
}

func (m *MockFlashcardService) ListFlashcards() (models.Flashcards, error) {
	args := m.Called()
	return args.Get(0).(models.Flashcards), args.Error(1)
}

func (m *MockFlashcardService) GetFlashcardByID(id uint64) (*models.Flashcard, error) {
	args := m.Called(id)
	return args.Get(0).(*models.Flashcard), args.Error(1)
}

func (m *MockFlashcardService) UpdateFlashcardByID(id uint64, req repositories.UpdateFlashcardRequest) (*models.Flashcard, error) {
	args := m.Called(id, req)
	return args.Get(0).(*models.Flashcard), args.Error(1)
}

func (m *MockFlashcardService) DeleteFlashcardByID(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockFlashcardService) ToggleTracking(id uint64) error {
	args := m.Called(id)
	return args.Error(0)
}

// Mock user Repo
type MockUserRepo struct {
	mock.Mock
}

func (m *MockUserRepo) CreateUser(req repositories.CreateUserRequest) (*models.User, error) {
	args := m.Called(req)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepo) ListUsers() (models.Users, error) {
	args := m.Called()
	return args.Get(0).(models.Users), args.Error(1)
}

func (m *MockUserRepo) GetUserByID(id string) (*models.User, error) {
	args := m.Called(id)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepo) GetUserByEmail(email string) (*models.User, error) {
	args := m.Called(email)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepo) GetUserByGoogleID(google_id string) (*models.User, error) {
	args := m.Called(google_id)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepo) GetUserByGoogleIDPrivate(google_id string) (*models.User, error) {
	args := m.Called(google_id)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepo) UpdateUserByID(id string, updateData map[string]interface{}) (*models.User, error) {
	args := m.Called(id, updateData)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *MockUserRepo) DeleteUserByGoogleID(google_id string) error {
	args := m.Called(google_id)
	return args.Error(0)
}

func (m *MockUserRepo) Save(user interface{}) error {
	args := m.Called(user)
	return args.Error(0)
}

// Mock flashcard repo
type MockFlashcardRepo struct {
	mock.Mock
}

func (m *MockFlashcardRepo) CreateFlashcard(req repositories.CreateFlashcardRequest) (*models.Flashcard, error) {
	args := m.Called(req)
	return args.Get(0).(*models.Flashcard), args.Error(1)
}

func (m *MockFlashcardRepo) ListFlashcards() (models.Flashcards, error) {
	args := m.Called()
	return args.Get(0).(models.Flashcards), args.Error(1)
}

func (m *MockFlashcardRepo) GetFlashcardByID(id uint64) (*models.Flashcard, error) {
	args := m.Called(id)
	return args.Get(0).(*models.Flashcard), args.Error(1)
}

func (m *MockFlashcardRepo) UpdateFlashcardByID(id uint64, req repositories.UpdateFlashcardRequest) (*models.Flashcard, error) {
	args := m.Called(id, req)
	return args.Get(0).(*models.Flashcard), args.Error(1)
}

func (m *MockFlashcardRepo) DeleteFlashcardByID(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockFlashcardRepo) DeleteTrackingByFlashcardID(flashcardID int) error {
	args := m.Called(flashcardID)
	return args.Error(0)
}

func (m *MockFlashcardRepo) Save(flashcard *models.Flashcard) error {
	args := m.Called(flashcard)
	return args.Error(0)
}
