package service

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

const flashcards = "FlashcardSets"

type UserService struct {
	db *gorm.DB
}

func NewUserSerivce(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(googleID, username, email, role string) (*models.User, error) {
	user := &models.User{
		GoogleID: googleID,
		Username: username,
		Email:    email,
		Role:     role,
	}
	if err := s.db.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) ListUsers() (models.Users, error) {
	var users models.Users
	if err := s.db.Preload(flashcards).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserByID(id uint64) (*models.User, error) {
	var user models.User
	if err := s.db.Preload(flashcards).First(&user, id).Error; err != nil {
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
