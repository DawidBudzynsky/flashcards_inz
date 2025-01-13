import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FlashcardSet, Folder } from '../types/interfaces';
import AddSetModal from '../components/AddSetToFolderModal';

import ListItem from "../components/ListItem";
import { useFolderStore } from '../hooks/stores/folderStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteFolderByID, getFolderByID } from '../requests/folder';
import { dateToString } from '../utils/showDate';

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

        <div className="p-4 max-w-5xl w-5/6 mx-auto space-y-6">

            <div className="w-screen max-w-5xl flex flex-col justify-center">

                <div className="max-w-5xl w-5/6 mx-auto flex justify-between">
                    <h1 className="text-4xl font-bold">{folder?.Name}</h1>
                    <span className="text-sm text-gray-600">Created: {dateToString(folder?.CreatedAt)}</span>
                </div>

                <div className="flex justify-start ps-24">
                    <span>Description: {folder?.Description}</span>
                </div>
            </div>

            <div className="flex w-3/4 mx-auto mb-4 gap-4">
                <AddSetModal />
                <button className="btn flex-1" onClick={() => { }}>Share</button>
                <button className="btn flex-1" onClick={() => { }}>Remove</button>
            </div>


            <h1 className='text-xl font-bold'>Sets avaliable in this folder:</h1>


            <div className="max-w-5xl w-full space-y-3">

                {folder?.FlashcardsSets.map((set: FlashcardSet) => (
                    <ListItem set={set} />
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

