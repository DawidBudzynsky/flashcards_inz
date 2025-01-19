import React, { useState } from "react";
import { Folder } from "../types/interfaces";

interface AddFolderModalProps {
	onFolderAdd?: (folder: Folder) => void; // Optional, if needed for immediate UI updates
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ onFolderAdd }) => {
	const [folderName, setFolderName] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFolderAdd?.({
			Name: folderName,
			Description: description,
			FlashcardsSets: [],
			ID: 0,
		});
	};

	return (
		<>
			<button
				className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 hover:scale-105 duration-150"
				onClick={() =>
					(
						document.getElementById(
							"my_modal_2"
						) as HTMLDialogElement
					)?.showModal()
				}
			>
				Create new Folder
			</button>
			<dialog id="my_modal_2" className="modal">
				<form onSubmit={handleSubmit} className="modal-box">
					<h3 className="font-bold text-lg">Create New Folder!</h3>
					<input
						type="text"
						placeholder="Enter the name of new folder"
						className="input input-bordered w-full max-w-xs mb-4"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Description"
						className="input input-bordered w-full max-w-xs mb-4"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<button
						type="submit"
						className="btn btn-primary w-full"
						onClick={() =>
							(
								document.getElementById(
									"my_modal_2"
								) as HTMLDialogElement
							)?.close()
						}
					>
						Create Folder
					</button>
				</form>
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</>
	);
};

export default AddFolderModal;
