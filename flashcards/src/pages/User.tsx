import { useState, useEffect } from 'react';
import { User, FlashcardSet, Folder } from '../types/interfaces';
import AddFolderModal from '../components/AddFolderModal';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

function Users() {
    const { user, setUser } = useUserStore();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [setUser]);

    const fetchUser = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/me', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();

            setUser(data);
            setLoading(false);
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
        }
    };

    const addFolder = (newFolder: Folder) => {
        if (user) {
            setUser({
                ...user,
                Folders: [...user.Folders, newFolder], // Add new folder to the Folders array
            });
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
                <div className="flex flex-col space-y-6">

                    {/* User Flashcard Sets Section */}
                    <div className="card bg-base-300 rounded-box">
                        <h2 className="text-3xl mb-4">Your Flashcard Sets</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {user?.FlashcardsSets.map((set: FlashcardSet) => (
                                <div
                                    draggable="true"
                                    key={set.ID}
                                    className="card bg-base-200 rounded-box p-4 cursor-pointer"
                                >
                                    <h3>{set.Title}</h3>
                                    {/* Add more set details if needed */}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Folders Section */}
                    <div className="card bg-base-300 rounded-box">
                        <h2 className="text-3xl mb-4">Your Folders</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {user?.Folders.map((folder: Folder) => (
                                <div
                                    key={folder.ID}
                                    className="card bg-base-200 rounded-box p-4 cursor-pointer"
                                    onClick={() => navigate(`/folders/${folder.ID}`)} // Navigate on click
                                >
                                    <h3>{folder.Name}</h3>

                                </div>
                            ))}
                        </div>
                        <AddFolderModal onFolderAdd={addFolder} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Users;
