import React, { useState } from "react";
import { Folder, FlashcardSet } from "../../types/interfaces";
import FolderItem from "./FolderItem";
import ListItem from "../ListItem";
import { useNavigate } from "react-router-dom";
import { IoCogOutline, IoPencil, IoTrashBin } from "react-icons/io5";
import useFlashcardSets from "../../hooks/useFlashcardsSets";
import useChangeSetFolder from "../../hooks/useChangeSetFolder";
import useDeleteFolder from "../../hooks/useDeleteFolder";
import { openModal } from "../../utils/modals";
import EditFolderModal from "./EditFolderModal";

interface FoldersAccordionProps {
	folders: Folder[];
}

const FoldersAccordion: React.FC<FoldersAccordionProps> = ({ folders }) => {
	const navigate = useNavigate();
	const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
	const { sets } = useFlashcardSets();
	//TODO: check if set is in
	// const { addSetToFolder } = useAddSetToFolder(flashcardSet, folderId);
	const { changeSetFolder } = useChangeSetFolder(activeFolderId);
	const { deleteFolder } = useDeleteFolder(String(activeFolderId));
	const activeFolder = folders.find((folder) => folder.ID === activeFolderId);

	const handleEdit = () => {
		navigate(`/folders/${activeFolder?.ID}`);
	};

	const handleDelete = () => {
		deleteFolder();
	};

	const handleChangeName = () => {
		openModal("edit_folder_modal");
		console.log("XD");
	};

	const handleFolderClick = (folderId: number) => {
		setActiveFolderId((prev) => (prev === folderId ? null : folderId));
	};

	const handleDrop = (folderId: number, flashcardSetId: number) => {
		changeSetFolder({
			flashcardSetId,
			oldFolderId: activeFolderId,
			folderId,
		});
	};

	if (folders?.length <= 0) {
		return <div>No folder found ☹️</div>;
	}

	return (
		<div className="flex flex-col md:flex-row">
			<EditFolderModal folder={activeFolder!} />
			<div className="flex">
				<div
					className={`join join-vertical w-full rounded-xl transition-all duration-300 ease-in-out`}
				>
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
				<div
					className={`transition-all duration-300 ease-in-out ${
						activeFolder ? "md:w-1/18" : "opacity-0 invisible "
					} md:relative md:top-0 flex md:block`}
				>
					<ul
						className={`menu bg-base-100 py-4 text-3xl font-semibold space-y-4 border-[1px] mx-2 rounded-3xl h-full md:hidden ${
							activeFolder ? "" : "hidden"
						}`}
					>
						<li className="mx-auto" onClick={handleChangeName}>
							<a>
								<IoPencil />
							</a>
						</li>
						<li className="mx-auto" onClick={handleEdit}>
							<a>
								<IoCogOutline />
							</a>
						</li>
						<li className="mx-auto" onClick={handleDelete}>
							<a>
								<IoTrashBin />
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div
				className={`transition-all duration-300 ease-in-out ${
					activeFolder ? "opacity-100 visible w-full" : "w-full"
				}`}
			>
				{activeFolder ? (
					<div className="flex flex-col rounded-xl py-4">
						{activeFolder.FlashcardsSets &&
						activeFolder.FlashcardsSets.length > 0 ? (
							activeFolder.FlashcardsSets.map(
								(set: FlashcardSet) => (
									<ListItem key={set.ID} set={set} />
								)
							)
						) : (
							<p className="text-gray-500 italic">
								No flashcards available in this folder.
							</p>
						)}

						<button
							onClick={handleEdit}
							className="border-[1px] md:w-1/3 mx-auto rounded-3xl p-8 font-semibold"
						>
							Edit this folder
						</button>
					</div>
				) : (
					<div className="flex flex-col rounded-xl py-4">
						{sets && sets.length > 0 ? (
							sets.map((set: FlashcardSet) => (
								<ListItem key={set.ID} set={set} />
							))
						) : (
							<p className="text-gray-500 italic">
								{`You don't have any flashcards sets :(`}
							</p>
						)}
					</div>
				)}
			</div>

			<div
				className={`transition-all duration-300 ease-in-out ${
					activeFolder ? "md:w-1/18" : "opacity-0 invisible"
				} md:relative md:top-0 flex md:block`}
			>
				<ul className="menu bg-base-100 py-4 text-3xl font-semibold hidden md:block space-y-4 border-[1px] my-4 rounded-3xl h-full">
					<li className="mx-auto" onClick={handleChangeName}>
						<a>
							<IoPencil />
						</a>
					</li>
					<li className="mx-auto" onClick={handleEdit}>
						<a>
							<IoCogOutline />
						</a>
					</li>
					<li className="mx-auto" onClick={handleDelete}>
						<a>
							<IoTrashBin />
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default FoldersAccordion;
