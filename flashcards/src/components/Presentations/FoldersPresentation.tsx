import { useMutation } from "@tanstack/react-query";
import { Folder } from "../../types/interfaces";
import { AnimatePresence } from "framer-motion";
import AddFolderModal from "../AddFolderModal";
import { createFolder } from "../../requests/folder";
import useFuzzySearch from "../../hooks/useFuzzySearch";
import FoldersAccordion from "../Folders/FolderAccordion";
import { notificationContext } from "../../utils/notifications";
import TabNavigation from "../../pages/TabNavigation";
import useFolders from "../../hooks/useFolders";

const FoldersPresentation: React.FC = () => {
	const { folders, refetch } = useFolders();

	const {
		query,
		setQuery,
		filteredData: filteredFolders,
	} = useFuzzySearch(folders || [], "", "Name");

	const { mutate: addFolder } = useMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			refetch();
			notificationContext.notifySuccess("Folder successfully added");
		},
		onError: (error: any) => {
			notificationContext.notifyError(
				`Failed to add folder: ${error.message}`
			);
		},
	});

	const handleAddFolder = (newFolder: Folder) => {
		addFolder(newFolder);
	};

	return (
		<div className="md:px-20">
			<TabNavigation />
			<div className="md:flex justify-between py-3">
				<h2 className="text-3xl mb-4">
					Your{" "}
					<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
						Folders
					</span>
				</h2>

				<input
					type="text"
					placeholder="Search for folder"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="input input-bordered w-full max-w-xs mb-4"
				/>

				<AddFolderModal onFolderAdd={handleAddFolder} />
			</div>
			<AnimatePresence>
				<FoldersAccordion folders={filteredFolders} />
			</AnimatePresence>
		</div>
	);
};

export default FoldersPresentation;
