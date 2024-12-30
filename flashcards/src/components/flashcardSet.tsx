import React from 'react';
import { FlashcardSet } from '../types/interfaces';
import { useUserStore } from '../stores/userStore';
import { useMutation } from '@tanstack/react-query';
import { updateFlashcardSetFolder } from '../requests/updateFlashcardSetFolder';
import { useFolderStore } from '../stores/folderStore';
import { useParams } from 'react-router-dom';


const FlashcardSetComponent: React.FC<{ flashcardSet: FlashcardSet }> = ({ flashcardSet }) => {
    const { user, setUser } = useUserStore();
    const { flashcardSets, setFlashcardSets, refreshFolderSets } = useFolderStore();
    const { folderId } = useParams<{ folderId: string }>();

    const { mutate } = useMutation(
        {
            mutationFn: (folderId: number) => updateFlashcardSetFolder(flashcardSet.ID, folderId),
            onSuccess: () => {
                refreshFolderSets(folderId);
            },
            onError: (error) => {
                console.error('Error updating folder:', error);
            },
        }
    );

    const handleAssignToFolder = (folderId: number) => {
        mutate(folderId);  // Uruchom mutację, aby zaktualizować folder
    };

    return (
        <div className="card w-full max-w-xxl bg-base-200 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="card-body p-4 flex flex-row justify-between items-center">
                {/* Left Side: Title */}
                <h3 className="text-xl font-semibold">{flashcardSet.Title}</h3>

                {/* Right Side: Button */}

                <button className="btn"
                    onClick={() => handleAssignToFolder(10)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FlashcardSetComponent;

