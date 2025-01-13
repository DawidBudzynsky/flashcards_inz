package models

import "time"

type User struct {
	// ID             int            `gorm:"primaryKey"`
	GoogleID       string         `gorm:"primaryKey" json:"google_id"`
	Username       string         `gorm:"size:255;not null"`
	Email          string         `gorm:"size:255;unique"`
	Role           string         `gorm:"size:255"`
	CreatedAt      time.Time      `gorm:"autoCreateTime"`
	FlashcardsSets FlashcardsSets `gorm:"foreignKey:UserGoogleID"`
	Folders        Folders        `gorm:"foreignKey:UserGoogleID"`
	UserFlashcards []UserFlashcard
}
type Users []User

// abstract to store information about user's knowledge about a card
type UserFlashcard struct {
	UserGoogleID              string    `gorm:"index"`       // Foreign key to User
	FlashcardID               int       `gorm:"index"`       // Foreign key to Flashcard
	Easiness                  float64   `gorm:"default:2.5"` // Easiness factor (default SM2 value)
	ConsecutiveCorrectAnswers int       `gorm:"default:0"`   // Streak of correct answers
	LastReviewed              time.Time `gorm:autoCreateTime`
	NextReviewDue             time.Time // When the card is next due for review
	TotalReviews              int       `gorm:"default:0"` // Total number of reviews

	Flashcard Flashcard
}

type UserFlashcards []UserFlashcard

type Folder struct {
	ID           int       `gorm:"primaryKey"`
	UserGoogleID string    `gorm:"index"` // Foreign key
	Name         string    `gorm:"size:255"`
	Description  string    `gorm:"size:255"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	// FlashcardsSets FlashcardsSets `gorm:"foreignKey:FolderID"`
	FlashcardsSets []FlashcardSet `gorm:"many2many:folder_sets;"`
}

type Folders []Folder

type FlashcardSet struct {
	ID           int       `gorm:"primaryKey"`
	UserGoogleID string    `gorm:"index"` // Foreign key
	Title        string    `gorm:"size:255"`
	Description  string    `gorm:"size:255"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	Flashcards   Flashcards
}
type FlashcardsSets []FlashcardSet

type Flashcard struct {
	ID             int       `gorm:"primaryKey"`
	FlashcardSetID int       `gorm:"index"` // Foreign key
	Question       string    `gorm:"size:255"`
	Answer         string    `gorm:"size:255"`
	Tracking       bool      `gorm:"default:false"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
}
type Flashcards []Flashcard

type Test struct {
	ID             int    `gorm:"primaryKey"`
	UserGoogleID   string `gorm:"index"`
	SetID          int    `gorm:"index"`
	StartTime      time.Time
	EndTime        time.Time
	TotalQuestions int
}
type Tests []Test
