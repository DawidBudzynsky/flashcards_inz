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
    Tracking: boolean
    CreatedAt: string;
}

export interface FlashcardToRevise {
    UserGoogleID: string
    FlashcardID: number;
    Easiness: number;
    ConsecutiveCorrectAnswers: number;
    LastReviewed: string;
    NextReviewDue: string;
    TotalReviews: number;
    Flashcard: Flashcard
}

export interface User {
    ID: number;
    GoogleID: string;
    Username: string;
    Email: string;
    Role: string;
    CreatedAt: string;
    FlashcardsSets: FlashcardSet[];
    Folders: any[]; // Adjust the type if you have a specific type for folders
}

export interface Folder {
    ID: number;
    Name: string;
    Description: string;
    FlashcardsSets: FlashcardSet[];
}
