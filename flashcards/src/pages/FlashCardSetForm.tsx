import React, { useState } from 'react';
import FlashcardInput from '../components/FlashcardInput';

interface Flashcard {
    question: string;
    answer: string;
}

const FlashCardSetForm: React.FC = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' },
    ]);

    const addFlashcard = () => {
        setFlashcards([...flashcards, { question: '', answer: '' }]);
    };

    const handleInputChange = (index: number, type: 'question' | 'answer', value: string) => {
        const newFlashcards = [...flashcards];
        newFlashcards[index][type] = value;
        setFlashcards(newFlashcards);
    };

    return (
        <div className="p-4">
            {flashcards.map((flashcard, index) => (
                <FlashcardInput
                    key={index}
                    index={index}
                    flashcard={flashcard}
                    handleInputChange={handleInputChange}
                />
            ))}
            <div className="flex justify-center p-4 border border-gray-300">
                <button onClick={addFlashcard} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Add more
                </button>
            </div>
        </div>
    );
};

export default FlashCardSetForm;
