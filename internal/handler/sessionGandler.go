package handler

import (
	"context"
	"flashcards/internal/middlewares"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
)

type NotificationManager struct {
	clients map[string]map[string]chan string
	mu      sync.Mutex
}

func NewConnectionManager() *NotificationManager {
	return &NotificationManager{
		clients: make(map[string]map[string]chan string),
	}
}

func (cm *NotificationManager) AddClient(testID, userID string, ch chan string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, exists := cm.clients[testID]; !exists {
		cm.clients[testID] = make(map[string]chan string)
	}

	cm.clients[testID][userID] = ch
	fmt.Printf("Added user %s to test %s\n", userID, testID)
}

func (cm *NotificationManager) RemoveClient(testID, userID string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if users, exists := cm.clients[testID]; exists {
		if ch, exists := users[userID]; exists {
			close(ch)
			delete(users, userID)
			fmt.Printf("Removed user %s from test %s\n", userID, testID)
		}
	}
}

func (cm *NotificationManager) GetClientChannel(testID, userID string) (chan string, bool) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if users, exists := cm.clients[testID]; exists {
		ch, ok := users[userID]
		return ch, ok
	}
	return nil, false
}

func (cm *NotificationManager) SseHandler(w http.ResponseWriter, r *http.Request) {
	testID := chi.URLParam(r, "testID")
	fmt.Println("Handling SSE for testID:", testID)

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	userID, ok := r.Context().Value(middlewares.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
		return
	}

	dataCh, ok := cm.GetClientChannel(testID, userID)
	if !ok {
		dataCh = make(chan string)
		cm.AddClient(testID, userID, dataCh)
	}

	timeout := time.After(30 * time.Minute)
	_, cancel := context.WithCancel(r.Context())
	defer cancel()

	for {
		select {
		case data := <-dataCh:
			fmt.Fprintf(w, "data: %s\n\n", data)

			if flusher, ok := w.(http.Flusher); ok {
				flusher.Flush()
			}

		case <-timeout:
			fmt.Println("User timed out, sending timeout message...")
			timeoutMessage := `data: {"event": "timeout", "message": "Your time has expired. Redirecting to test list."}\n\n`
			fmt.Fprintf(w, timeoutMessage)
			if flusher, ok := w.(http.Flusher); ok {
				flusher.Flush()
			}
			cm.RemoveClient(testID, userID)
			return

		case <-r.Context().Done():
			fmt.Println("Client disconnected")
			cm.RemoveClient(testID, userID)
			return
		}
	}
}

func (cm *NotificationManager) Notify(testID, userID string, message string) {
	if msgChannel, ok := cm.GetClientChannel(testID, userID); ok {
		select {
		case msgChannel <- message:
		default:
			fmt.Println("Channel full or closed, message not sent")
		}
	} else {
		fmt.Println("No active channel for the user")
	}
}

func (cm *NotificationManager) BroadcastTestNotification(testID, message string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if users, exists := cm.clients[testID]; exists {
		for userID, ch := range users {
			select {
			case ch <- message:
			default:
				fmt.Printf("Failed to send message to user %s in test %s\n", userID, testID)
			}
		}
	}
}
