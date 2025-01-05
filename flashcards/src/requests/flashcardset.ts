import api from '../api/api';

export const getFlashcardSetByID = async (setID: string) => {
    const url = `/flashcards_sets/${setID}`;
    return await api.get(url);
};
