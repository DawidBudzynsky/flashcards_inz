# Simple Makefile for a Go project
#
FRONTEND_DIR=flashcards

# Build the application
all: build

build:
	@echo "Building..."
	@go build -o main cmd/api/main.go

# Run the backend
run-backend:
	@echo "Starting backend..."
	@go run cmd/api/main.go

# Run the frontend
run-frontend:
	@echo "Starting frontend..."
	@cd $(FRONTEND_DIR) && npm install && npm run dev

# Run both backend and frontend in parallel
run:
	@echo "Starting backend and frontend..."
	@make -j2 run-backend run-frontend


# Test the application
test:
	@echo "Testing servies"
	@go test ./tests/service -v
	@echo "Testing tests"
	@go test ./tests -v
	@echo "Testing algorithms"
	@go test ./tests/algorithims -v

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f main

# Live Reload
watch:
	@if command -v air > /dev/null; then \
	    air; \
	    echo "Watching...";\
	else \
	    read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
	    if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
	        go install github.com/cosmtrek/air@latest; \
	        air; \
	        echo "Watching...";\
	    else \
	        echo "You chose not to install air. Exiting..."; \
	        exit 1; \
	    fi; \
	fi

.PHONY: all build run test clean
