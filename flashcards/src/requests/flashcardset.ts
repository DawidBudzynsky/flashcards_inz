import api from '../api/api';

export interface FlashcardSetRequest {
    title: string,
    description: string,
    folder_id: number | null,
}

export const createFlashcardSet = async (body: FlashcardSetRequest) => {
    const url = "/flashcards_sets"
    return await api.post(url, body)
}

export const getFlashcardSetByID = async (setID: string) => {
    const url = `/flashcards_sets/${setID}`;
    return await api.get(url);
};
