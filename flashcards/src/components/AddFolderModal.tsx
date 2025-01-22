import React, { useState } from "react";
import { Folder } from "../types/interfaces";
import CreateButton from "./Buttons/CreateButton";
import { MAX_FOLDER_DESCRIPTION, MAX_FOLDER_NAME } from "../utils/constants";

interface AddFolderModalProps {
	onFolderAdd?: (folder: Folder) => void;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ onFolderAdd }) => {
	const [folderName, setFolderName] = useState("");
	const [description, setDescription] = useState("");
	const [nameError, setNameError] = useState(false);
	const [descError, setDescError] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFolderAdd?.({
			Name: folderName,
			Description: description,
			FlashcardsSets: [],
			ID: 0,
		});
	};

	const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFolderName(value);
		setNameError(value.length >= MAX_FOLDER_NAME);
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setDescription(value);
		setDescError(value.length >= MAX_FOLDER_DESCRIPTION);
	};

	return (
		<>
			<CreateButton title="Create new Folder" modal_id="my_modal_2" />
			<dialog id="my_modal_2" className="modal">
				<form onSubmit={handleSubmit} className="modal-box">
					<h3 className="font-bold text-lg">Create New Folder!</h3>

					<p className="text-xs text-gray-500">
						{folderName.length} / {MAX_FOLDER_NAME}
						{nameError && (
							<span className="text-red-500">
								{" "}
								- Maximum reached!
							</span>
						)}
					</p>

					<input
						type="text"
						placeholder="Enter the name of new folder"
						className={`input input-bordered w-full max-w-xs mb-4 ${
							nameError ? "border-red-500" : ""
						}`}
						value={folderName}
						onChange={handleFolderNameChange}
						required
						maxLength={MAX_FOLDER_NAME}
					/>

					<p className="text-xs text-gray-500">
						{description.length} / {MAX_FOLDER_DESCRIPTION}
						{descError && (
							<span className="text-red-500">
								{" "}
								- Maximum reached!
							</span>
						)}
					</p>
					<input
						type="text"
						placeholder="Description"
						className={`input input-bordered w-full max-w-xs mb-4 ${
							descError ? "border-red-500" : ""
						}`}
						value={description}
						onChange={handleDescriptionChange}
						required
						maxLength={MAX_FOLDER_DESCRIPTION}
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
