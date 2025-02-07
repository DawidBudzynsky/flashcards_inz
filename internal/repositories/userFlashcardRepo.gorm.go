package repositories

import (
	"flashcards/internal/models"
	"time"

	"gorm.io/gorm"
)

type TrackingRepoInterface interface {
	GetFlashcardsForToday(UserID string) ([]models.Flashcard, error)
	GetByCardID(cardID int) (*models.Tracking, error)
	Create(*models.Tracking) (*models.Tracking, error)
	UpdateByID(id int, body *models.Tracking) (*models.Tracking, error)
}

type TrackingRepo struct {
	db *gorm.DB
}

func NewTrackingRepo(db *gorm.DB) *TrackingRepo {
	return &TrackingRepo{db: db}
}

func (r *TrackingRepo) GetFlashcardsForToday(UserID string) ([]models.Flashcard, error) {
	var flashcards []models.Flashcard
	err := r.db.Preload("Tracking").
		Joins("JOIN trackings ON trackings.flashcard_id = flashcards.id").
		Where("trackings.next_review_due <= ?", time.Now()).
		Find(&flashcards).Error

	return flashcards, err
}

func (r *TrackingRepo) GetByCardID(cardID int) (*models.Tracking, error) {
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

func (r *TrackingRepo) Create(userFlashcard *models.Tracking) (*models.Tracking, error) {
	if err := r.db.Create(userFlashcard).Error; err != nil {
		return nil, err
	}

	return userFlashcard, nil
}

func (r *TrackingRepo) UpdateByID(id int, body *models.Tracking) (*models.Tracking, error) {
	if err := r.db.Model(&models.Tracking{}).Where("flashcard_id = ?", id).Updates(body).Error; err != nil {
		return nil, err
	}

	userFlashcard, err := r.GetByCardID(id)
	if err != nil {
		return nil, err
	}
	return userFlashcard, nil
}
