package models

import (
	"errors"
	"time"
)

type User struct {
	// ID             int            `gorm:"primaryKey"`
	GoogleID  string    `gorm:"primaryKey" json:"google_id"`
	Username  string    `gorm:"size:255;not null"`
	Email     string    `gorm:"size:255;unique"`
	Role      string    `gorm:"size:255"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	IsPrivate bool      `gorm:"default:true"`

	FlashcardsSets FlashcardsSets `gorm:"foreignKey:UserGoogleID"`
	Folders        Folders        `gorm:"foreignKey:UserGoogleID"`
	Tests          Tests          `gorm:"foreignKey:UserGoogleID"`
	AssignedTo     []Test         `gorm:"many2many:test_users;joinForeignKey:UserGoogleID;joinReferences:TestID"`
}
type Users []User

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
	IsPrivate    bool      `gorm:"default:true"`
	Flashcards   Flashcards
}
type FlashcardsSets []FlashcardSet

type Flashcard struct {
	ID             int       `gorm:"primaryKey"`
	UserGoogleID   string    `gorm:"index"` // Foreign key
	FlashcardSetID int       `gorm:"index"` // Foreign key
	Question       string    `gorm:"size:255"`
	Answer         string    `gorm:"size:255"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`

	Tracking *Tracking
}
type Flashcards []Flashcard

// abstract to store information about user's knowledge about a card
type Tracking struct {
	FlashcardID               int       `gorm:"index"`       // Foreign key to Flashcard
	Easiness                  float64   `gorm:"default:2.5"` // Easiness factor (default SM2 value)
	ConsecutiveCorrectAnswers int       `gorm:"default:0"`   // Streak of correct answers
	LastReviewed              time.Time `gorm:autoCreateTime`
	NextReviewDue             time.Time // When the card is next due for review
	TotalReviews              int       `gorm:"default:0"` // Total number of reviews
}

type Test struct {
	ID            int            `gorm:"primaryKey"`
	UserGoogleID  string         `gorm:"index"`
	StartDate     time.Time      `gorm:autoCreateTime`
	DueDate       time.Time      // When the test is next due
	Title         string         `gorm:"size:255"`
	Description   string         `gorm:"size:255"`
	NumQuestions  int            `gorm:"index"`
	Sets          []FlashcardSet `gorm:"many2many:test_sets;foreignKey:ID;joinTableForeignKey:test_id;joinTableReferenceID:flashcard_set_id"`
	AccessToken   string         `gorm:"unique;"` // Token for sharing the test
	AssignedUsers []User         `gorm:"many2many:test_users;joinForeignKey:TestID;joinReferences:UserGoogleID"`
}
type Tests []Test

// IsValid checks if the test is open or expired based on today's date
func (t *Test) IsValid() error {
	currentTime := time.Now()

	if currentTime.Before(t.StartDate) {
		return errors.New("the test is not yet open. Please wait until the start date")
	}

	if currentTime.After(t.DueDate) {
		return errors.New("the test has expired. You can no longer take the test")
	}

	return nil
}

type TestQuestion struct {
	Question      string
	CorrectAnswer string
	AnswerOptions []string
}

type TestResult struct {
	ID           uint64    `gorm:"primaryKey"`
	TestID       uint64    `gorm:"not null"`
	UserGoogleID string    `gorm:"not null"`
	Answers      []byte    `gorm:"type:jsonb"`
	Score        int       `gorm:"not null"`
	Submitted    time.Time `gorm:"not null"`
	IsFinished   bool      `gorm:"default:false"` // Independent field per user
}

type TestUser struct {
	TestID       int       `gorm:"index"`
	UserGoogleID string    `gorm:"index"` // User with access to the test
	AccessToken  string    `gorm:"index"`
	AssignedAt   time.Time `gorm:"autoCreateTime"`
}
