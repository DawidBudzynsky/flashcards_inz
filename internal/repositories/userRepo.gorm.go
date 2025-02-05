package repositories

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

const (
	flashcard_sets = "FlashcardsSets"
	folders        = "Folders"
)

type UserRepoInterface interface {
	CreateUser(CreateUserRequest) (*models.User, error)
	ListUsers() (models.Users, error)
	GetUserByID(string) (*models.User, error)
	GetUserByEmail(string) (*models.User, error)
	GetUserByGoogleID(string) (*models.User, error)
	GetUserByGoogleIDPrivate(string) (*models.User, error)
	UpdateUserByID(string, map[string]interface{}) (*models.User, error)
	DeleteUserByGoogleID(string) error
	Save(interface{}) error
}

type CreateUserRequest struct {
	GoogleID string `json:"google_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (s *UserRepo) CreateUser(body CreateUserRequest) (*models.User, error) {
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

func (s *UserRepo) ListUsers() (models.Users, error) {
	var users models.Users
	if err := s.db.Preload(flashcard_sets).Preload(folders).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserRepo) GetUserByID(id string) (*models.User, error) {
	var user models.User
	if err := s.db.Preload("FlashcardsSets.Flashcards").Preload(folders).Where("google_id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserRepo) GetUserByGoogleID(google_id string) (*models.User, error) {
	var user models.User
	if err := s.db.Preload("FlashcardsSets.Flashcards").Preload("Folders").Preload("Tests").Where("google_id = ?", google_id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserRepo) GetUserByGoogleIDPrivate(google_id string) (*models.User, error) {
	var user models.User
	if err := s.db.Preload("FlashcardsSets", "is_private = ?", false).
		Where("google_id = ?", google_id).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *UserRepo) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	// NOTE: here without preload, make sure its okay
	err := s.db.First(&user, "email = ?", email).Error
	if err == nil {
		return &user, nil
	}

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return nil, err
}

func (s *UserRepo) UpdateUserByID(id string, updateData map[string]interface{}) (*models.User, error) {
	user, err := s.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	if err := s.db.Model(user).Updates(updateData).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserRepo) DeleteUserByGoogleID(id string) error {
	if err := s.db.Where("user_google_id = ?", id).Delete(&models.Flashcard{}).Error; err != nil {
		return err
	}

	if err := s.db.Where("user_google_id = ?", id).Delete(&models.FlashcardSet{}).Error; err != nil {
		return err
	}

	if err := s.db.Where("google_id = ?", id).Delete(&models.User{}).Error; err != nil {
		return err
	}
	return nil
}

func (s *UserRepo) Save(value interface{}) error {
	if err := s.db.Save(value).Error; err != nil {
		return err
	}
	return nil
}
