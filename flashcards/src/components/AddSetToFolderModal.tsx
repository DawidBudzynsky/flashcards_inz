import React from 'react';
import { FlashcardSet } from '../types/interfaces';
import FlashcardSetComponent from './flashcardSet';
import { useUserData } from '../hooks/userData';
import SetsList from './SetsList';

const AddSetModal: React.FC = () => {
    const { flashcardSets } = useUserData();

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
                <SetsList sets={flashcardSets} />
                {/* Close Button */}
                <form method="dialog" className="modal-backdrop">
                    <button className="btn">Close</button>
                </form>
            </dialog>
        </>
    );
};

export default AddSetModal;
