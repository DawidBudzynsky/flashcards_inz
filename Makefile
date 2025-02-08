# Simple Makefile for a Go + React project with SQLite database setup

# Paths
FRONTEND_DIR=flashcards
DB_FILE=test.db

# Build the application
all: build

build:
	@echo "Building backend..."
	@go build -o main cmd/api/main.go

run-backend-prod: 
	@echo "Starting backend in production mode..."
	@./main 

run-frontend-prod: build-frontend
	@echo "Starting frontend in production mode..."
	@cd $(FRONTEND_DIR) && npm run build && serve -s build

run-prod: 
	@echo "Starting backend and frontend in production mode..."
	@make -j2 run-backend-prod run-frontend-prod

run-backend-dev: 
	@echo "Starting backend in development mode..."
	@go run cmd/api/main.go 

run-frontend-dev:
	@echo "Starting frontend in development mode..."
	@cd $(FRONTEND_DIR) && npm install && npm run dev

run-dev: 
	@echo "Starting backend and frontend in development mode..."
	@make -j2 run-backend-dev run-frontend-dev

run: dev
	@echo "Running in default (development) mode, use 'make run prod' for production."

build-frontend:
	@echo "Building frontend..."
	@cd $(FRONTEND_DIR) && npm install && npm run build


test:
	@echo "Testing servies"
	@go test ./tests/service -v
	@echo "Testing tests"
	@go test ./tests -v
	@echo "Testing algorithms"
	@go test ./tests/algorithims -v

clean:
	@echo "Cleaning up..."
	@rm -f main $(DB_FILE)

watch:
	@if command -v air > /dev/null; then \
	    air; \
	else \
	    read -p "Go's 'air' is not installed. Install it? [Y/n] " choice; \
	    if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
	        go install github.com/cosmtrek/air@latest; \
	        air; \
	    else \
	        echo "Skipping air installation."; \
	    fi; \
	fi

.PHONY: all build run run-prod run-dev run-backend-prod run-frontend-prod run-backend-dev run-frontend-dev test clean watch build-frontend
