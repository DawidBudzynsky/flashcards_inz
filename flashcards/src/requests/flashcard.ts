import api from '../api/api';

export const sendFlashcardReview = async (reviewData: { CardID: number, Quality: number }) => {
    const url = `/reviews/`;
    return await api.post(url, reviewData);
};
