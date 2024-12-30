import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FlashcardSet, Folder } from '../types/interfaces';
import AddSetModal from '../components/AddSetToFolderModal';
import { useFolderStore } from '../stores/folderStore';

function FolderView() {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const [folder, setFolder] = useState<Folder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { flashcardSets, refreshFolderSets } = useFolderStore(); // Access Zustand store

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                await refreshFolderSets(folderId!); // Refresh the folder sets
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch folder data');
                setLoading(false);
            }
        };

        fetchFolder();
    }, [folderId, refreshFolderSets]);


    // if (loading) {
    //     return <div>Loading...</div>;
    // }
    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

    const handleDelete = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this folder?");
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:8080/folders/${folderId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Folder deleted successfully.");
                navigate(-1);
            } else {
                const error = await response.json();
                alert(`Failed to delete folder: ${error.message}`);
            }
        } catch (error) {
            console.error("Error deleting folder:", error);
            alert("An unexpected error occurred.");
        }
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
                        <li><a onClick={handleDelete}>Delete folder</a></li>

                    </ul>
                </div>

            </div>
            <div className="grid grid-cols-3 gap-4 bg-blue-100">
                {flashcardSets.map((set: FlashcardSet) => (
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

