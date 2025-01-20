package repositories

import (
	"flashcards/internal/models"
	"time"

	"gorm.io/gorm"
)

type UserFlashcardRepo struct {
	db *gorm.DB
}

func NewUserFlashcardRepo(db *gorm.DB) *UserFlashcardRepo {
	return &UserFlashcardRepo{db: db}
}

func (r *UserFlashcardRepo) GetFlashcardsForToday(UserID string) ([]models.Flashcard, error) {
	var flashcards []models.Flashcard
	err := r.db.Preload("Tracking").
		Joins("JOIN trackings ON trackings.flashcard_id = flashcards.id").
		Where("trackings.next_review_due <= ?", time.Now()).
		Find(&flashcards).Error

	return flashcards, err
}

func (r *UserFlashcardRepo) GetByCardID(cardID int) (*models.Tracking, error) {
	var userFlashcard models.Tracking
	err := r.db.First(&userFlashcard, "flashcard_id = ?", cardID).Error
	if err == nil {
		return &userFlashcard, nil
	}

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}

	return nil, err
}

func (r *UserFlashcardRepo) Create(userFlashcard *models.Tracking) (*models.Tracking, error) {
	if err := r.db.Create(userFlashcard).Error; err != nil {
		return nil, err
	}

	return userFlashcard, nil
}

func (r *UserFlashcardRepo) UpdateByID(id int, body *models.Tracking) (*models.Tracking, error) {
	// TODO: where should also include userID
	if err := r.db.Model(&models.Tracking{}).Where("flashcard_id = ?", id).Updates(body).Error; err != nil {
		return nil, err
	}

	userFlashcard, err := r.GetByCardID(id)
	if err != nil {
		return nil, err
	}
	return userFlashcard, nil
}
