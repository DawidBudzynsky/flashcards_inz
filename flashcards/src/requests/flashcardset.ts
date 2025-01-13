import api from '../api/api';

export interface FlashcardSetRequest {
    title: string,
    description: string,
    folder_id: number | null,
}

export const createFlashcardSet = async (body: FlashcardSetRequest, folderId: number | null) => {
    let url = "/flashcards_sets"
    if (folderId) {
        url += `?inFolder=${folderId}`
    }
    return await api.post(url, body)
}

export const updateFlashcardSetByID = async (setID: string, body: FlashcardSetRequest) => {
    const url = `/flashcards_sets/${setID}`
    return await api.put(url, body)
}

export const deleteSetByID = async (setID: string) => {
    const url = `/flashcards_sets/${setID}`
    return await api.delete(url, setID)
}

export const getFlashcardSetByID = async (setID: string) => {
    const url = `/flashcards_sets/${setID}`;
    return await api.get(url);
};
