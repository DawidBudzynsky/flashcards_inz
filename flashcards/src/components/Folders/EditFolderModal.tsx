import React, { useEffect, useState } from "react";
import { Folder } from "../../types/interfaces";
import { closeModal } from "../../utils/modals";
import useEditFolder from "../../hooks/useEditFolder";
import { MAX_FOLDER_DESCRIPTION, MAX_FOLDER_NAME } from "../../utils/constants";

interface EditFolderModalProps {
	folder: Folder;
}

const EditFolderModal: React.FC<EditFolderModalProps> = ({ folder }) => {
	const [folderName, setFolderName] = useState("");
	const [description, setDescription] = useState("");

	const { editFolder } = useEditFolder();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleEdit();
	};

	const handleEdit = () => {
		editFolder({
			folderId: String(folder.ID),
			folderData: {
				Name: folderName,
				Description: description,
			},
		});
		closeModal("edit_folder_modal");
	};

	useEffect(() => {
		setFolderName(folder?.Name || "");
		setDescription(folder?.Description || "");
	}, [folder]);

	return (
		<>
			<dialog id="edit_folder_modal" className="modal">
				<form onSubmit={handleSubmit} className="modal-box">
					<h3 className="font-bold text-lg">Edit Folder!</h3>
					<input
						type="text"
						placeholder="Enter new folder name"
						className="input input-bordered w-full max-w-xs mb-4"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
						required
						maxLength={MAX_FOLDER_NAME}
					/>
					<input
						type="text"
						placeholder="Enter new folder description"
						className="input input-bordered w-full max-w-xs mb-4"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						maxLength={MAX_FOLDER_DESCRIPTION}
					/>
					<button type="submit" className="btn btn-primary w-full">
						Edit
					</button>
				</form>
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditFolderModal;
