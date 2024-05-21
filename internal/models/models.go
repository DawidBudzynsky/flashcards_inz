package models

import "time"

type User struct {
	ID            int            `gorm:"primaryKey"`
	GoogleID      string         `gorm:"size:255"`
	Username      string         `gorm:"size:255"`
	Email         string         `gorm:"size:255;unique"`
	Role          string         `gorm:"size:255"`
	CreatedAt     time.Time      `gorm:"autoCreateTime"`
	FlashcardSets FlashcardsSets `gorm:"foreignKey:UserID"`
}
type Users []User

type Folder struct {
	ID             int       `gorm:"primaryKey"`
	UserID         int       `gorm:"index"` // Foreign key
	Name           string    `gorm:"size:255"`
	Description    string    `gorm:"size:255"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	FlashcardsSets FlashcardsSets
}

type Folders []Folder

type FlashcardSet struct {
	ID          int       `gorm:"primaryKey"`
	UserID      int       `gorm:"index"` // Foreign key
	Title       string    `gorm:"size:255"`
	Description string    `gorm:"size:255"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	FolderID    int       `gorm:"index"`
	Flashcards  Flashcards
}
type FlashcardsSets []FlashcardSet

type Flashcard struct {
	ID             int       `gorm:"primaryKey"`
	FlashcardSetID int       `gorm:"index"`
	Question       string    `gorm:"size:255"`
	Answer         string    `gorm:"size:255"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
}

type Flashcards []Flashcard
