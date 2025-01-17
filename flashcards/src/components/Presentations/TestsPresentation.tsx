import { useQuery } from "@tanstack/react-query";
import { Test } from "../../types/interfaces";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTestModal from "../CreateTestModal";
import { getUserTests } from "../../requests/test";

const TestsPresentation: React.FC = () => {
	const navigate = useNavigate();
	// const [searchQuery, setSearchQuery] = useState("");

	interface response {
		finished: Test[];
		not_finished: Test[];
	}

	const { data: tests, refetch } = useQuery<response>({
		queryKey: ["tests"],
		queryFn: getUserTests,
		staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
	});

	// const filteredFolders = folders?.filter((folder: Folder) =>
	// 	fuzzyMatch(searchQuery.toLowerCase(), folder.Name.toLowerCase())
	// );

	// const { mutate: addFolder } = useMutation({
	// 	mutationFn: createFolder,
	// 	onSuccess: (newFolder: Folder) => {
	// 		refetch();
	// 		navigate(`/folders/${newFolder.ID}`);
	// 	},
	// 	onError: (error: any) => {
	// 		console.error("Error adding folder:", error);
	// 		alert(`Failed to add folder: ${error.message}`);
	// 	},
	// });

	// const handleAddFolder = (newFolder: Folder) => {
	// 	addFolder(newFolder);
	// };

	return (
		<div className="p-4 max-w-5xl w-full mx-auto">
			<div className="flex justify-between w-5/6 mx-auto py-3">
				<h2 className="text-3xl mb-4">Your Tests</h2>
				<CreateTestModal />
			</div>

			<div className="max-w-5xl w-full space-y-3">
				<h3>Not finished tests</h3>
				{tests?.not_finished.map((test: Test) => (
					<div
						key={test.ID}
						className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
						onClick={() => navigate(`/tests/${test.ID}/questions`)} // Navigate on click
					>
						<h3>
							test opens:{" "}
							{new Date(test.StartDate).toLocaleDateString()}
						</h3>

						<h3>
							test is due to:{" "}
							{new Date(test.DueDate).toLocaleDateString()}
						</h3>
					</div>
				))}
				<h3>Finished tests</h3>
				{tests?.finished.map((test: Test) => (
					<div
						key={test.ID}
						className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
						onClick={() => navigate(`/tests/${test.ID}/questions`)} // Navigate on click
					>
						<h3>
							test opens:{" "}
							{new Date(test.StartDate).toLocaleDateString()}
						</h3>

						<h3>
							test is due to:{" "}
							{new Date(test.DueDate).toLocaleDateString()}
						</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default TestsPresentation;
