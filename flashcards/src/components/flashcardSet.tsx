import React from 'react';
import { FlashcardSet } from '../types/interfaces';
import FlashcardComponent from './flashcard';

interface FlashcardSetProps {
    flashcardSet: FlashcardSet;
}

const FlashcardSetComponent: React.FC<FlashcardSetProps> = ({ flashcardSet }) => {
    return (
        <div>
            <h3>Title: {flashcardSet.Title}</h3>
            <p>Description: {flashcardSet.Description}</p>
            {flashcardSet.Flashcards && flashcardSet.Flashcards.length > 0 ? (
                <ul className="flex flex-col justify-center items-center">
                    {flashcardSet.Flashcards.map((flashcard) => (
                        <li key={flashcard.ID}>
                            <FlashcardComponent flashcard={flashcard} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No flashcards available</p>
            )}
        </div>
    );
};

export default FlashcardSetComponent;

