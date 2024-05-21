package services

import (
	"flashcards/internal/database"
	"flashcards/internal/models"
)

type UserService struct {
	db database.Service
}

func (u *UserService) Create(user *models.User, db) {
}
