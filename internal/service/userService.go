package service

import (
	"flashcards/internal/models"
	"flashcards/internal/repositories"
)

type UserService struct {
	repo repositories.UserRepoInterface
}

func NewUserSerivce(repo repositories.UserRepoInterface) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (s *UserService) CreateUser(body repositories.CreateUserRequest) (*models.User, error) {
	// business logic here
	user, err := s.repo.CreateUser(body)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) ListUsers() (models.Users, error) {
	// business logic here
	users, err := s.repo.ListUsers()
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserByID(id string) (*models.User, error) {
	// business logic here
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetUserByGoogleID(google_id string) (*models.User, error) {
	// business logic here

	user, err := s.repo.GetUserByGoogleID(google_id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetUserByGoogleIDPrivate(google_id string) (*models.User, error) {
	user, err := s.repo.GetUserByGoogleIDPrivate(google_id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) UpdateUserByID(id string, updateData map[string]interface{}) (*models.User, error) {
	user, err := s.repo.UpdateUserByID(id, updateData)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) DeleteUserByID(id uint64) error {
	if err := s.repo.DeleteUserByID(id); err != nil {
		return err
	}
	return nil
}

func (s *UserService) ToggleVisibility(google_id string) (*models.User, error) {
	user, err := s.repo.GetUserByGoogleID(google_id)
	if err != nil {
		return nil, err
	}

	// toggle isPrivate
	user.IsPrivate = !user.IsPrivate

	if err := s.repo.Save(user); err != nil {
		return nil, err
	}

	return user, nil
}
