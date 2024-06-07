package service

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

const (
	flashcard_sets = "FlashcardsSets"
	folders        = "Folders"
)

type UserServiceInterface interface {
	CreateUser(CreateUserRequest) (*models.User, error)
	ListUsers() (models.Users, error)
	GetUserByID(uint64) (*models.User, error)
	UpdateUserByID(uint64, map[string]interface{}) (*models.User, error)
	DeleteUserByID(uint64) error
}

type CreateUserRequest struct {
	GoogleID string `json:"google_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

type UserService struct {
	db *gorm.DB
}

func NewUserSerivce(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(body CreateUserRequest) (*models.User, error) {
	user := &models.User{
		GoogleID: body.GoogleID,
		Username: body.Username,
		Email:    body.Email,
		Role:     body.Role,
	}
	if err := s.db.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) ListUsers() (models.Users, error) {
	var users models.Users
	if err := s.db.Preload(flashcard_sets).Preload(folders).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserByID(id uint64) (*models.User, error) {
	var user models.User
	if err := s.db.Preload(flashcard_sets).Preload(folders).First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserService) UpdateUserByID(id uint64, updateData map[string]interface{}) (*models.User, error) {
	user, err := s.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(user).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) DeleteUserByID(id uint64) error {
	if err := s.db.Delete(&models.User{}, id).Error; err != nil {
		return err
	}
	return nil
}
