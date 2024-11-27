package main

import (
	"flashcards/internal/auth"
	"flashcards/internal/server"
	"fmt"
)

func main() {
	auth.NewAuth()
	server := server.NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
