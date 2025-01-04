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
	Flashcards   Flashcards
}
type FlashcardsSets []FlashcardSet

type Flashcard struct {
	ID             int       `gorm:"primaryKey"`
	FlashcardSetID int       `gorm:"index"` // Foreign key
	Question       string    `gorm:"size:255"`
	Answer         string    `gorm:"size:255"`
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
