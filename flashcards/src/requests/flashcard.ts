import api from '../api/api';


export interface FlashcardsDataRequest {
    flashcard_set_id: number,
    question: string,
    answer: string,
}

export interface FlashcardsDataUpdateRequest {
    id: string
    question: string,
    answer: string,
}

export interface FlashcardReviewRequest {
    CardID: number,
    Quality: number
}

export const createFlashcards = async (flashcardsData: FlashcardsDataRequest[]) => {
    const url = `/flashcards/`;
    return await api.post(url, flashcardsData);
};

export const updateFlashcards = async (flashcardsData: FlashcardsDataUpdateRequest[]) => {
    const url = `/flashcards/`;
    return await api.put(url, flashcardsData);
};

export const sendFlashcardReview = async (reviewData: FlashcardReviewRequest) => {
    const url = `/reviews/`;
    return await api.post(url, reviewData);
};

