import React from "react";
import { FlashcardSet, Folder } from "../types/interfaces";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appendSetToFolder, removeSetFromFolder } from "../requests/folder";
import useAddSetToFolder from "../hooks/useAddSetTofolder";

const FlashcardSetComponent: React.FC<{ flashcardSet: FlashcardSet }> = ({
	flashcardSet,
}) => {
	const { folderId } = useParams<{ folderId: string }>();
	const queryClient = useQueryClient();
	const { addSetToFolder } = useAddSetToFolder(flashcardSet, folderId);

	const { mutate: removeSetMutation } = useMutation({
		mutationFn: (folderId: number) =>
			removeSetFromFolder(flashcardSet.ID, folderId),
		onSuccess: () => {
			queryClient.setQueryData<Folder>(
				["folder", folderId],
				(oldData) => {
					if (!oldData) return oldData;

					const updatedSets = oldData.FlashcardsSets.filter(
						(set) => set.ID !== flashcardSet.ID
					);

					return { ...oldData, FlashcardsSets: updatedSets };
				}
			);
		},
		onError: (error) => {
			console.error("Error removing set from folder:", error);
		},
	});

	const handleAssignToFolder = (folderId: number) => {
		addSetToFolder(folderId);
	};

	const handleRemoveFromFolder = (folderId: number) => {
		removeSetMutation(folderId);
	};

	const folderData = queryClient.getQueryData<Folder>(["folder", folderId]);
	const isSetInFolder = folderData?.FlashcardsSets.some(
		(set) => set.ID === flashcardSet.ID
	);

	return (
		<div className="card w-full max-w-xxl bg-base-200 shadow-lg hover:scale-105 transition-all duration-300">
			<div className="card-body p-4 flex flex-row justify-between items-center">
				<h3 className="text-xl font-semibold">{flashcardSet.Title}</h3>
				{isSetInFolder ? (
					<button
						className="btn"
						onClick={() => handleRemoveFromFolder(Number(folderId))}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-red-500"
							fill="currentColor"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							/>
						</svg>
					</button>
				) : (
					<button
						className="btn"
						onClick={() => handleAssignToFolder(Number(folderId))}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					</button>
				)}
			</div>
		</div>
	);
};

export default FlashcardSetComponent;
