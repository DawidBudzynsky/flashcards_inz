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
            < div className="modal-box max-w-7xl w-full rounded-3xl space-y-5" >
                <p><strong>A:</strong> {flashcard.Answer}</p>
                <p><strong>Q:</strong> {flashcard.Question}</p>
            </div>
        </div>
    );
};

export default FlashcardComponent;
