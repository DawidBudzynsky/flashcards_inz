import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FlashcardSet, Folder } from '../types/interfaces';

function FolderView() {
    const { folderId } = useParams<{ folderId: string }>();
    const navigate = useNavigate();
    const [folder, setFolder] = useState<Folder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFolder();
    }, [folderId]);

    const fetchFolder = async () => {
        try {
            const response = await fetch(`http://localhost:8080/folders/${folderId}`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch folder');
            }
            const data = await response.json();

            console.log(data)
            setFolder(data);
            setLoading(false);
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-screen flex justify-center">
            <div className="px-6 py-6">
                <h1 className="text-3xl mb-6">{folder?.Name}</h1>
                <button
                    className="btn mb-6"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    Back
                </button>
                <div className="grid grid-cols-3 gap-4">
                    {/* {folder?.FlashcardsSets.map((set: FlashcardSet) => ( */}
                    {/*     <div */}
                    {/*         key={set.ID} */}
                    {/*         className="card bg-base-200 rounded-box p-4 cursor-pointer text-black" */}
                    {/*     > */}
                    {/*         <h3>{set.Title}</h3> */}
                    {/*     </div> */}
                    {/* ))} */}
                </div>
            </div>
        </div>
    );
}

export default FolderView;

