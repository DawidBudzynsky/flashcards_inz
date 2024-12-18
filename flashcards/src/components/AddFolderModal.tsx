import React, { useState } from 'react';
import { Folder } from '../types/interfaces';

interface AddFolderModalProps {
    onFolderAdd: (folder: Folder) => void;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ onFolderAdd }) => {
    const [folderName, setFolderName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: folderName,
                    description: description,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create folder');
            }

            const newFolder = await response.json();
            onFolderAdd(newFolder); // Notify parent component

            // Reset the form and close the modal
            setFolderName('');
            setDescription('');
            (document.getElementById('my_modal_2') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    return (
        <>
            <button
                className="btn"
                onClick={() =>
                    (document.getElementById('my_modal_2') as HTMLDialogElement)?.showModal()
                }
            >
                +
            </button>
            <dialog id="my_modal_2" className="modal">
                <form onSubmit={handleSubmit} className="modal-box">
                    <h3 className="font-bold text-lg">Create New Folder!</h3>
                    <input
                        type="text"
                        placeholder="Enter the name of new folder"
                        className="input input-bordered w-full max-w-xs mb-4"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="input input-bordered w-full max-w-xs mb-4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary w-full">
                        Create Folder
                    </button>
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    );
};

export default AddFolderModal;

