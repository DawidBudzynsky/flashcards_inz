import { useMutation, useQuery } from "@tanstack/react-query";
import { Folder } from "../../types/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AddFolderModal from "../AddFolderModal";
import { createFolder, getUserFolders } from "../../requests/folder";
import useFuzzySearch from "../../hooks/useFuzzySearch";

const FoldersPresentation: React.FC = () => {
	const navigate = useNavigate();

	const { data: folders, refetch } = useQuery<Folder[]>({
		queryKey: ["folders"],
		queryFn: getUserFolders,
		// staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
	});

	const {
		query,
		setQuery,
		filteredData: filteredFolders,
	} = useFuzzySearch(folders || [], "", "Name");

	const { mutate: addFolder } = useMutation({
		mutationFn: createFolder,
		onSuccess: (newFolder: Folder) => {
			refetch();
			navigate(`/folders/${newFolder.ID}`);
		},
		onError: (error: any) => {
			console.error("Error adding folder:", error);
			alert(`Failed to add folder: ${error.message}`);
		},
	});

	const handleAddFolder = (newFolder: Folder) => {
		addFolder(newFolder);
	};

	return (
		<div className="p-4 max-w-5xl w-full mx-auto">
			<div className="flex justify-between w-5/6 mx-auto py-3">
				<h2 className="text-3xl mb-4">Your Folders</h2>

				<input
					type="text"
					placeholder="Search for folder"
					value={query} // Controlled input
					onChange={(e) => setQuery(e.target.value)} // Update query on change
					className="input input-bordered w-full max-w-xs"
				/>

				<AddFolderModal onFolderAdd={handleAddFolder} />
			</div>
			<div className="max-w-5xl w-full space-y-3">
				<AnimatePresence>
					{filteredFolders && filteredFolders.length > 0 ? (
						filteredFolders.map((folder: Folder) => (
							<div
								key={folder.ID}
								className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
								onClick={() =>
									navigate(`/folders/${folder.ID}`)
								}
							>
								<h3>{folder.Name}</h3>
							</div>
						))
					) : (
						<motion.div
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}
							transition={{
								duration: 0.3,
							}}
							className="text-center text-gray-500 mt-4"
						>
							No searches found ☹️
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default FoldersPresentation;
