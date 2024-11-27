package util

import (
	"encoding/gob"
	"net/http"

	"github.com/markbates/goth/gothic"
)

type UserSession struct {
	UserID string
	Email  string
}

const sessionName = "_user_session"

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
