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
    Question: string;
    Answer: string;
    CreatedAt: string;
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
}
