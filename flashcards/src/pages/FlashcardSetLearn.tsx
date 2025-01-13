import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFlashcardSetByID } from '../requests/flashcardset';
import { useQuery } from '@tanstack/react-query';

const FlashcardSetLearn: React.FC = () => {
    const { setId: setID } = useParams<{ setId: string }>();

    const { data: set, status: setStatus } = useQuery({
        queryKey: ['flashcardSet', setID],
        queryFn: () => getFlashcardSetByID(setID!),
    });

    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [scaleDirection, setScaleDirection] = useState<'left' | 'right' | ''>('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === ' ') {
                setIsFlipped(!isFlipped);
            } else if (event.key === 'ArrowRight') {
                goToNextFlashcard();
            } else if (event.key === 'ArrowLeft') {
                goToPreviousFlashcard();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFlipped, currentFlashcardIndex]);

    const goToPreviousFlashcard = () => {
        if (currentFlashcardIndex > 0) {
            setScaleDirection('left');
            setCurrentFlashcardIndex(currentFlashcardIndex - 1);
            setIsFlipped(false);
            animateBackToNormal();
        }
    };

    const goToNextFlashcard = () => {
        if (set && currentFlashcardIndex < set.Flashcards.length - 1) {
            setScaleDirection('right');
            setCurrentFlashcardIndex(currentFlashcardIndex + 1);
            setIsFlipped(false);
            animateBackToNormal();

        } else if (currentFlashcardIndex === set.Flashcards.length - 1) {
            // If the user is on the last flashcard, show the Congratulations alert
            alert('Congratulations! You have completed all the flashcards!');
        }
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const animateBackToNormal = () => {
        setTimeout(() => {
            setScaleDirection('');
        }, 150); // 150ms for faster transition
    };

    if (!set || !set.Flashcards || set.Flashcards.length === 0) {
        return <div>No flashcards available.</div>;
    }

    const flashcard = set.Flashcards[currentFlashcardIndex];

    // Calculate the progress as a percentage
    const progress = ((currentFlashcardIndex) / set.Flashcards.length) * 100;

    return (
        <div className="p-4 max-w-5xl w-5/6 mx-auto space-y-6">
            <div className="text-3xl font-bold">{set.Title}</div>

            {/* Flashcard Display */}
            <div className="flex justify-center items-center">
                <div
                    className={`flip-card relative w-96 h-80 bg-base-200 shadow-lg rounded-lg cursor-pointer transition-transform duration-300 
                    ${scaleDirection === 'right' ? 'transform translate-x-6' : ''}
                    ${scaleDirection === 'left' ? 'transform -translate-x-6' : ''}
                    ${isFlipped ? 'flipped' : ''}`}
                    onClick={handleCardClick}
                >
                    {/* Front of the card */}
                    <div className="flip-card-front absolute inset-0 flex justify-center items-center text-2xl font-semibold">
                        {flashcard.Question}
                    </div>

                    {/* Back of the card */}
                    <div className="flip-card-back absolute inset-0 flex justify-center items-center text-2xl font-semibold">
                        {flashcard.Answer}
                    </div>
                </div>
            </div>

            {/* Flashcard Progress Bar */}
            <div className="grid justify-center mx-auto mt-4 text-lg font-semibold">
                <progress className="progress w-56" value={progress} max="100"></progress>
                <span>
                    {currentFlashcardIndex + 1} / {set.Flashcards.length}
                </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-3 mt-4">
                <button
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    onClick={goToPreviousFlashcard}
                    disabled={currentFlashcardIndex === 0}
                >
                    Previous
                </button>
                <button
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    onClick={goToNextFlashcard}
                    disabled={currentFlashcardIndex === set.Flashcards.length}
                >
                    Next
                </button>
            </div>
        </div >
    );
};

export default FlashcardSetLearn;

