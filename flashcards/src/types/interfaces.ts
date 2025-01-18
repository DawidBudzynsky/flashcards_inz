export interface FlashcardSet {
	ID: number;
	UserID: number;
	Title: string;
	Description: string;
	CreatedAt: string;
	FolderID: number;
	Flashcards: any; // Adjust the type if you have a specific type for flashcards
}

export interface Flashcard {
	ID: number;
	FlashcardSetID: number;
	Question: string;
	Answer: string;
	CreatedAt: string;
	Tracking: Tracking;
}

export interface Tracking {
	FlashcardID: number;
	Easiness: number;
	ConsecutiveCorrectAnswers: number;
	LastReviewed: string;
	NextReviewDue: string;
	TotalReviews: number;
}

export interface FlashcardToRevise {
	UserGoogleID: string;
	FlashcardID: number;
	Easiness: number;
	ConsecutiveCorrectAnswers: number;
	LastReviewed: string;
	NextReviewDue: string;
	TotalReviews: number;
	Flashcard: Flashcard;
}

export interface User {
	ID: number;
	GoogleID: string;
	Username: string;
	Email: string;
	Role: string;
	CreatedAt: string;
	Tests: Test[];
	FlashcardsSets: FlashcardSet[];
	Folders: any[]; // Adjust the type if you have a specific type for folders
}
export interface Folder {
	ID: number;
	Name: string;
	Description: string;
	FlashcardsSets: FlashcardSet[];
}

export interface Test {
	ID: number;
	UserGoogleID: string;
	StartDate: string;
	DueDate: string;
	NumQuestions: number;
	Sets: FlashcardSet[];
	AccessToken: string;
	AssignedUsers: User[];
}
