import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, FlashcardSet, Folder } from '../types/interfaces';
import AddFolderModal from '../components/AddFolderModal';
import { getUser } from '../requests/user';
import { createFolder } from '../requests/folder';

function Users() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch user data using useQuery
    const { data: user, status: userStatus, error: userError } = useQuery<User>({
        queryKey: ["user"],
        queryFn: getUser,
    });

    // Mutation for adding a folder
    const { mutate: addFolder, isLoading: addingFolder } = useMutation({
        mutationFn: createFolder,
        onSuccess: (newFolder: Folder) => {
            // Update the user data in the cache
            queryClient.setQueryData<User>(["user"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    Folders: [...oldData.Folders, newFolder],
                };
            });
            navigate(`/folders/${newFolder.ID}`);
        },
        onError: (error: any) => {
            console.error("Error adding folder:", error);
            alert(`Failed to add folder: ${error.message}`);
        },
    });

    // Handle folder addition
    const handleAddFolder = (newFolder: Folder) => {
        addFolder(newFolder); // Trigger the mutation
    };

    if (userStatus === "loading") {
        return <div>Loading...</div>;
    }

    if (userStatus === "error") {
        return <div>Error: {(userError as Error).message}</div>;
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
                        <AddFolderModal onFolderAdd={handleAddFolder} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Users;

