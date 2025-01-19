import React, { useState } from "react";
import { Folder, FlashcardSet } from "../../types/interfaces";
import FolderItem from "./FolderItem";
import ListItem from "../ListItem";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSetFolder } from "../../requests/folder";

interface FoldersAccordionProps {
	folders: Folder[];
}

const FoldersAccordion: React.FC<FoldersAccordionProps> = ({ folders }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [activeFolderId, setActiveFolderId] = useState<number | null>(null);

	const { mutate } = useMutation({
		mutationFn: (data: { flashcardSetId: number; folderId: number }) =>
			changeSetFolder(data.flashcardSetId, activeFolderId, data.folderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
		onError: (error) => {
			console.error("Error appending flashcard set to folder:", error);
		},
	});

	const handleDrop = (folderId: number, flashcardSetId: number) => {
		mutate({
			flashcardSetId,
			folderId,
		});
	};

	const activeFolder = folders.find((folder) => folder.ID === activeFolderId);

	const handleEdit = () => {
		navigate(`/folders/${activeFolder?.ID}`);
	};

	const handleFolderClick = (folderId: number) => {
		setActiveFolderId((prev) => (prev === folderId ? null : folderId));
	};

	if (folders?.length <= 0) {
		return <div>No folder found ☹️</div>;
	}

	return (
		<div className="flex">
			<div className="join join-vertical w-1/3 p-4 rounded-xl">
				{folders.map((folder) => (
					<FolderItem
						key={folder.ID}
						folder={folder}
						isActive={activeFolderId === folder.ID}
						onClick={() => handleFolderClick(folder.ID)}
						onDrop={handleDrop}
					/>
				))}
			</div>

			<div className="flex-1">
				{activeFolder ? (
					<div className="flex join join-vertical rounded-xl py-4">
						{activeFolder.FlashcardsSets &&
						activeFolder.FlashcardsSets.length > 0 ? (
							activeFolder.FlashcardsSets.map(
								(set: FlashcardSet) => (
									// <SetItem key={set.ID} set={set} />
									<ListItem key={set.ID} set={set} />
								)
							)
						) : (
							<p className="join-item text-gray-500 italic">
								No flashcards available in this folder.
							</p>
						)}

						<button
							onClick={handleEdit}
							className="join-item max-w-5xl border-[1px] p-8 font-semibold"
						>
							Edit this folder
						</button>
					</div>
				) : (
					<p className="text-lg text-gray-500 italic">
						Click a folder to view its flashcards.
					</p>
				)}
			</div>
		</div>
	);
};

export default FoldersAccordion;
