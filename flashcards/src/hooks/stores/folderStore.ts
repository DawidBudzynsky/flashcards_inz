import { create } from "zustand";
import { FlashcardSet, User } from "../types/interfaces";

interface FolderStore {
    flashcardSets: FlashcardSet[];
    setFlashcardSets: (sets: FlashcardSet[]) => void;
    refreshFolderSets: (folderId: string) => Promise<void>;
}

export const useFolderStore = create<FolderStore>((set) => ({
    flashcardSets: [],
    setFlashcardSets: (sets) => set({ flashcardSets: sets }),
    refreshFolderSets: async (folderId) => {
        try {
            const response = await fetch(`http://localhost:8080/folders/${folderId}`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch folder sets');
            }
            const data = await response.json();
            set({ flashcardSets: data.FlashcardsSets });
        } catch (error) {
            console.error('Error fetching folder sets:', error);
        }
    },
}));
