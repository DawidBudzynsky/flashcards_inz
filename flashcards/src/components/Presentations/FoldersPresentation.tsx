import { useMutation, useQuery } from "@tanstack/react-query";
import { Folder } from "../../types/interfaces";
import { AnimatePresence } from "framer-motion";
import AddFolderModal from "../AddFolderModal";
import { createFolder, getUserFolders } from "../../requests/folder";
import useFuzzySearch from "../../hooks/useFuzzySearch";
import FoldersAccordion from "../Folders/FolderAccordion";
import { notificationContext } from "../../utils/notifications";

const FoldersPresentation: React.FC = () => {
	const { data: folders, refetch } = useQuery<Folder[]>({
		queryKey: ["folders"],
		queryFn: getUserFolders,
	});

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
		<div className="md:max-w-5xl w-full mx-auto">
			<div className="md:flex justify-between w-5/6 mx-auto py-3">
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
			<div className="md:max-w-5xl w-full space-y-3">
				<AnimatePresence>
					<FoldersAccordion folders={filteredFolders} />
				</AnimatePresence>
			</div>
		</div>
	);
};

export default FoldersPresentation;
