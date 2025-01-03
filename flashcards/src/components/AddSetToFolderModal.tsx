import React from 'react';
import { FlashcardSet } from '../types/interfaces';
import { useUserStore } from '../hooks/stores/userStore';
import FlashcardComponent from './flashcard';
import FlashcardSetComponent from './flashcardSet';

const AddSetModal: React.FC = () => {
    const { user } = useUserStore(); // Pobranie danych użytkownika z Zustand store

    return (
        <>
            {/* Button to open the modal */}
            <button
                className="btn"
                onClick={() => (document.getElementById('my_modal_4') as HTMLDialogElement)?.showModal()}
            >
                +
            </button>

            {/* Modal */}
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-3xl">
                    <h3 className="font-bold text-lg mb-4">Available Sets</h3>
                    {user?.FlashcardsSets && user.FlashcardsSets.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {/* Rendering each flashcard set */}
                            {user.FlashcardsSets.map((set: FlashcardSet) => (
                                <div key={set.ID} className="flex justify-center">
                                    <FlashcardSetComponent flashcardSet={set} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">No sets available</div>
                    )}
                </div>

                {/* Close Button */}
                <form method="dialog" className="modal-backdrop">
                    <button className="btn">Close</button>
                </form>
            </dialog>
        </>
    );
};

export default AddSetModal;
