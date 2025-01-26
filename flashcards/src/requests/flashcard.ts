import api from "../api/api";

export interface FlashcardsDataRequest {
  flashcard_set_id: number;
  question: string;
  answer: string;
}

export interface FlashcardsDataUpdateRequest {
  id: string;
  flashcard_set_id: number;
  question: string;
  answer: string;
}

export interface FlashcardReviewRequest {
  CardID: number;
  Quality: number;
}

export const createFlashcards = async (
  flashcardsData: FlashcardsDataRequest[],
) => {
  const url = `/flashcards/`;
  return await api.post(url, flashcardsData);
};

export const updateFlashcards = async (
  flashcardsData: FlashcardsDataUpdateRequest[],
) => {
  const url = `/flashcards/`;
  return await api.put(url, flashcardsData);
};

export const sendFlashcardReview = async (
  reviewData: FlashcardReviewRequest,
) => {
  const url = `/user_flashcards/reviews`;
  return await api.put(url, reviewData);
};

export const toggleFlashcardTracking = async (id: number) => {
  const url = `/flashcards/${id}/tracking`;
  return await api.put(url);
};

export const getFlashcardsForToday = async () => {
  const url = `/user_flashcards/flashcards_today`;
  return await api.get(url);
};

export interface TranslateRequest {
  q: string;
  source: string;
  target: string;
  format: "text";
}
export const translate = async (translateRequest: TranslateRequest) => {
  const url = `/flashcards/translate`;
  return await api.post(url, translateRequest);
};
