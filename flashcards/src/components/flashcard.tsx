import React, { useState } from 'react';
import { Flashcard } from '../types/interfaces';

interface FlashcardProps {
    flashcard: Flashcard;
}

const FlashcardComponent: React.FC<FlashcardProps> = ({ flashcard }) => {
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    return (
        <div onClick={toggleAnswer} className="cursor-pointer mb-4">
            <div className="bg-gray-800 w-64 h-64 flex justify-center items-center rounded-lg p-4 transition-transform duration-300 transform hover:scale-95">
                {showAnswer ? (
                    <p><strong>A:</strong> {flashcard.Answer}</p>
                ) : (
                    <p><strong>Q:</strong> {flashcard.Question}</p>
                )}
            </div>
        </div>
    );
};

export default FlashcardComponent;
