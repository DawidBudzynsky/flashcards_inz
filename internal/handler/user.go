package handler

import (
	"encoding/json"
	"flashcards/internal/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type User struct {
	DB *gorm.DB
}

func (u *User) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User create called")
	var body struct {
		GoogleID string `json:"google_id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	user := models.User{
		GoogleID: body.GoogleID,
		Username: body.Username,
		Email:    body.Email,
		Role:     body.Role,
	}

	if result := u.DB.Create(&user); result.Error != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode user", http.StatusInternalServerError)
	}
}

func (u *User) List(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User list called")

	var users []models.User
	if result := u.DB.Preload("FlashcardSets").Find(&users); result.Error != nil {
		// if result := u.DB.Find(&users); result.Error != nil {
		http.Error(w, "Failed to retrieve users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}

func (u *User) GetByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User GetByID called")
	idParam := chi.URLParam(r, "id")
	userID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var user models.User
	if result := u.DB.Preload("FlashcardSets").First(&user, userID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to retrieve user", http.StatusInternalServerError)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}

// Currently updates every field, which means when you udpate only one, the rest will be set to none
func (u *User) UpdateByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User UpdateByID called")
	idParam := chi.URLParam(r, "id")
	userID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var updatedUser models.User
	if err := json.NewDecoder(r.Body).Decode(&updatedUser); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var user models.User
	if result := u.DB.First(&user, userID); result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to retrieve user", http.StatusInternalServerError)
		}
		return
	}

	user.GoogleID = updatedUser.GoogleID
	user.Username = updatedUser.Username
	user.Email = updatedUser.Email
	user.Role = updatedUser.Role

	if result := u.DB.Save(&user); result.Error != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, "Failed to encode user", http.StatusInternalServerError)
	}
}

func (u *User) DeleteByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User DeleteByID called")
}
