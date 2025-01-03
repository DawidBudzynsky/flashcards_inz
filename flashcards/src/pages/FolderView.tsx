import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FlashcardSet, Folder } from '../types/interfaces';
import AddSetModal from '../components/AddSetToFolderModal';
import { useFolderStore } from '../hooks/stores/folderStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteFolderByID, getFolderByID } from '../requests/folder';

function FolderView() {
    const navigate = useNavigate();
    const { folderId: folderID } = useParams<{ folderId: string }>();

    const { data: folder, status: statusFolder } = useQuery({
        queryKey: ["folder", folderID],
        queryFn: () => getFolderByID(folderID!),
    });

    // Mutation to delete the folder
    const { mutate: deleteFolder, isLoading: isDeleting } = useMutation({
        mutationFn: () => deleteFolderByID(folderID!),
        onSuccess: () => {
            alert("Folder deleted successfully.");
            navigate(-1);
        },
        onError: (error: any) => {
            console.error("Error deleting folder:", error);
            alert(`Failed to delete folder: ${error?.message || "An unexpected error occurred."}`);
        },
    });

    const handleDelete = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this folder?");
        if (confirmation) { deleteFolder() };
    };

    return (
        <div className="w-screen flex flex-col justify-center">
            <div className="px-6 py-6 flex flex-row bg-orange-100 justify-center">
                <h1 className="text-3xl mb-6">{folder?.Name}</h1>

                <AddSetModal />

                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">...</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a>Share</a></li>
                        <li><a onClick={handleDelete}>
                            {isDeleting ? "Deleting..." : "Delete Folder"}
                        </a></li>

                    </ul>
                </div>

            </div>
            <div className="grid grid-cols-3 gap-4 bg-blue-100">
                {folder?.FlashcardsSets.map((set: FlashcardSet) => (
                    <div
                        key={set.ID}
                        className="card bg-base-200 rounded-box p-4 cursor-pointer text-black"
                    >
                        <h3>{set.Title}</h3>
                    </div>
                ))}

                <button
                    className="btn mb-6"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back
                </button>
            </div>

        </div>
    );
}

export default FolderView;

