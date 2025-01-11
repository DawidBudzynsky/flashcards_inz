package repositories

import (
	"flashcards/internal/models"

	"gorm.io/gorm"
)

type UserFlashcardRepo struct {
	db *gorm.DB
}

func NewUserFlashcardRepo(db *gorm.DB) *UserFlashcardRepo {
	return &UserFlashcardRepo{db: db}
}

func (r *UserFlashcardRepo) GetByCardID(cardID int) (*models.UserFlashcard, error) {
	var userFlashcard models.UserFlashcard
	err := r.db.First(&userFlashcard, "flashcard_id = ?", cardID).Error
	if err == nil {
		return &userFlashcard, nil
	}

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return nil, err
}

func (r *UserFlashcardRepo) Create(userFlashcard *models.UserFlashcard) (*models.UserFlashcard, error) {
	if err := r.db.Create(userFlashcard).Error; err != nil {
		return nil, err
	}

	return userFlashcard, nil
}

func (r *UserFlashcardRepo) UpdateByID(id int, body *models.UserFlashcard) (*models.UserFlashcard, error) {
	userFlashcard, err := r.GetByCardID(id)
	if err != nil {
		return nil, err
	}

	// TODO: where should also include userID
	if err := r.db.Model(&models.UserFlashcard{}).Where("flashcard_id = ?", id).Updates(body).Error; err != nil {
		return nil, err
	}
	return userFlashcard, nil
}
