package util

import (
	"encoding/gob"
	"fmt"
	"net/http"

	"github.com/markbates/goth/gothic"
)

type UserSession struct {
	UserID string
	Email  string
}

const (
	sessionName = "_user_session"
	userIdKey   = "use_id" ///? hgw
)

func init() {
	gob.Register(UserSession{})
}

func setSessionValue(w http.ResponseWriter, r *http.Request, key, value any) error {
	session, _ := gothic.Store.New(r, sessionName)
	session.Values[key] = value
	return session.Save(r, w)
}

func SetUserSession(w http.ResponseWriter, r *http.Request, userSession UserSession) error {
	return setSessionValue(w, r, "userSession", userSession)
}

func getFromSession(r *http.Request, key string) (string, error) {
	session, err := gothic.Store.Get(r, sessionName)
	if value, ok := session.Values[key]; ok {
		return value.(string), nil
	}
	return "", err
}

func IsUserLoggedIn(r *http.Request) bool {
	session, _ := gothic.Store.Get(r, sessionName)
	_, ok := session.Values[userIdKey]
	return ok
}

func GetUserSessionFromStore(r *http.Request) (UserSession, error) {
	session, err := gothic.Store.Get(r, sessionName)
	if value, ok := session.Values["userSession"]; ok {
		return value.(UserSession), nil
	}
	return UserSession{}, fmt.Errorf("User session not found %s", err)
}

func GetUserIDFromSession(r *http.Request) (string, error) {
	user, err := GetUserSessionFromStore(r)
	if err != nil {
		return "", err
	}
	return user.UserID, nil
}

func SetSessionValueMap(w http.ResponseWriter, r *http.Request, value map[any]any) error {
	session, _ := gothic.Store.New(r, sessionName)
	session.Values = value
	return session.Save(r, w)
}

func RemoveCookieSession(w http.ResponseWriter, r *http.Request) error {
	session, _ := gothic.Store.Get(r, sessionName)
	session.Options.MaxAge = -1
	return session.Save(r, w)
}
