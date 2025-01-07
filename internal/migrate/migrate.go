package main

import (
	"flashcards/internal/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dburl := os.Getenv("DB_URL")
	fmt.Println(dburl)
	db, err := gorm.Open(sqlite.Open(dburl), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.FlashcardSet{},
		&models.Flashcard{},
		&models.Folder{},
		&models.UserFlashcard{})
	if err != nil {
		log.Fatal("failed to migrate database", err)
	}
}
