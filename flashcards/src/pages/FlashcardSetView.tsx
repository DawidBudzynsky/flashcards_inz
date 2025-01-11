import { useParams, useNavigate } from 'react-router-dom';
import { getFlashcardSetByID } from '../requests/flashcardset';
import { Flashcard } from '../types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';


const FlashcardSetView: React.FC = () => {
    const navigate = useNavigate();
    const { setId: setID } = useParams<{ setId: string }>();

    const { data: set, status: setStatus } = useQuery({
        queryKey: ["flashcardSet", setID],
        queryFn: () => getFlashcardSetByID(setID!),
    });

    const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
    const [selectedCardID, setSelectedCardID] = useState<number | null>(null);

    const handleReviewClick = (quality: number, cardID: number) => {
        setSelectedQuality(quality);
        setSelectedCardID(cardID);

        const reviewData = {
            CardID: cardID,
            Quality: quality,
        };
    }

    return (
        <div className="w-screen flex justify-center">
            <div className="w-screen max-w-5xl flex flex-col justify-center">

                <div className="px-6 py-6 grid grid-cols-2 bg-orange-100 justify-between items-center">
                    <h1 className="text-3xl mx-auto">{set?.Title}</h1>
                    <span className="text-sm text-gray-600">{set?.CreatedAt}</span>
                </div>

                <div className="px-3 py-3 flex flex-row bg-orange-400 justify-center">
                    <span>{set?.Description}</span>
                </div>

                <div className="px-6 flex justify-center gap-4 bg-blue-100">
                    <div className="max-w-5xl">
                        <div className="card card-compact bg-base-100 w-96 shadow-xl">
                            <figure className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                <div className="w-64 h-64 bg-blue-500 flex items-center justify-center">
                                    <h1 className='text-5xl'>{set?.Flashcards[0].Question}</h1>
                                </div>
                            </figure>
                        </div>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <div className='max-w-xl grid grid-cols-5 gap-2'>
                        {Array.from({ length: 5 }, (_, index) => (
                            <button
                                key={index}
                                className='btn'
                                onClick={() => handleReviewClick(index + 1, set?.Flashcards[0].ID!)} // Set the CardID as the first card's ID for simplicity
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>


                <div className="px-6 flex justify-center gap-4 bg-blue-100">
                    {set?.Flashcards.map((flashcard: Flashcard) => (
                        <div className="card bg-base-200 w-1/5 rounded-box p-4" >
                            <h3>{flashcard.Question}</h3>
                            <h3>{flashcard.Answer}</h3>
                        </div>
                    ))}
                </div>

                <button
                    className="btn mb-6"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back
                </button>

            </div >
        </div >
    );
}

export default FlashcardSetView;

