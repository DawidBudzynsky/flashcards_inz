import React from 'react';

interface Flashcard {
    question: string;
    answer: string;
}

interface FlashcardInputProps {
    index: number;
    flashcard: Flashcard;
    handleInputChange: (index: number, type: 'question' | 'answer', value: string) => void;
}

const FlashcardInput: React.FC<FlashcardInputProps> = ({ index, flashcard, handleInputChange }) => (
    <div className="flex mb-5 w-full space-x-10 bg-blue-900 px-6 py-2 rounded-lg">
        <div className="w-1/2">
            <input
                type="text"
                name={`question_${index}`}
                id={`question_${index}`}
                className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
                value={flashcard.question}
                onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                style={{ overflowWrap: 'break-word' }}
                required
            />
            <label
                htmlFor={`question_${index}`}
                className="block mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
                Question
            </label>
        </div>
        <div className="w-1/2">
            <input
                type="text"
                name={`answer_${index}`}
                id={`answer_${index}`}
                className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
                value={flashcard.answer}
                onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                style={{ overflowWrap: 'break-word' }}
                required
            />
            <label
                htmlFor={`answer_${index}`}
                className="block mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
                Answer
            </label>
        </div>
    </div>
);

export default FlashcardInput;
