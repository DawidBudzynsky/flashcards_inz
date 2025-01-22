import { useParams, useNavigate } from "react-router-dom";
import { FlashcardSet } from "../types/interfaces";
import AddSetModal from "../components/AddSetToFolderModal";
import ListItem from "../components/ListItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteFolderByID, getFolderByID } from "../requests/folder";
import { dateToString } from "../utils/showDate";
import { notificationContext } from "../utils/notifications";
import useDeleteFolder from "../hooks/useDeleteFolder";

function FolderView() {
	const navigate = useNavigate();
	const { folderId: folderID } = useParams<{ folderId: string }>();

	const { data: folder } = useQuery({
		queryKey: ["folder", folderID],
		queryFn: () => getFolderByID(folderID!),
	});

	const { deleteFolder } = useDeleteFolder(folderID!);

	const handleDelete = async () => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this folder?"
		);
		if (confirmation) {
			deleteFolder();
		}
	};

	return (
		<div className="md:max-w-5xl w-full mx-auto space-y-6">
			<div className="w-screen md:max-w-5xl flex flex-col justify-center">
				<div className="md:max-w-5xl w-5/6 mx-auto md:flex justify-between">
					<h1 className="text-4xl font-bold">{folder?.Name}</h1>
					<span className="text-sm text-gray-600">
						Created: {dateToString(folder?.CreatedAt)}
					</span>
				</div>

				<div className="md:flex justify-start">
					<span>Description: {folder?.Description}</span>
				</div>
			</div>

			<div className="flex md:w-3/4 mx-auto mb-4 gap-4">
				<AddSetModal />
				<button className="btn flex-1" onClick={() => {}}>
					Share
				</button>
				<button className="btn flex-1" onClick={handleDelete}>
					Remove
				</button>
			</div>

			<h1 className="text-xl font-bold">
				Sets avaliable in this folder:
			</h1>

			<div className="max-w-5xl w-full space-y-3">
				{folder?.FlashcardsSets.map((set: FlashcardSet) => (
					<ListItem set={set} />
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
