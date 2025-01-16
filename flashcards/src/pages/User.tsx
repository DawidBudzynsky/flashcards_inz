import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, FlashcardSet, Folder, Test } from "../types/interfaces";
import AddFolderModal from "../components/AddFolderModal";
import { getUser } from "../requests/user";
import { createFolder } from "../requests/folder";
import CreateTestModal from "../components/CreateTestModal";
import ListItem from "../components/ListItem";
import { motion, AnimatePresence } from "framer-motion";
import { fuzzyMatch } from "../utils/fuzzySearch";

function Users() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchQuery, setSearchQuery] = useState("");

	const [activeTab, setActiveTab] = useState("flashcards");
	const tabs = [
		{ id: "flashcards", label: "Sets" },
		{ id: "folders", label: "Folders" },
		{ id: "tests", label: "Tests" },
	];

	// Fetch user data using useQuery
	const {
		data: user,
		status: userStatus,
		error: userError,
	} = useQuery<User>({
		queryKey: ["user"],
		queryFn: getUser,
	});

	const filteredSets = user?.FlashcardsSets.filter((set: FlashcardSet) =>
		fuzzyMatch(searchQuery.toLowerCase(), set.Title.toLowerCase())
	);

	// Mutation for adding a folder
	const { mutate: addFolder, isLoading: addingFolder } = useMutation({
		mutationFn: createFolder,
		onSuccess: (newFolder: Folder) => {
			// Update the user data in the cache
			queryClient.setQueryData<User>(["user"], (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					Folders: [...oldData.Folders, newFolder],
				};
			});
			navigate(`/folders/${newFolder.ID}`);
		},
		onError: (error: any) => {
			console.error("Error adding folder:", error);
			alert(`Failed to add folder: ${error.message}`);
		},
	});

	// Handle folder addition
	const handleAddFolder = (newFolder: Folder) => {
		addFolder(newFolder); // Trigger the mutation
	};

	if (userStatus === "loading") {
		return <div>Loading...</div>;
	}

	if (userStatus === "error") {
		return <div>Error: {(userError as Error).message}</div>;
	}
	const handleNavigate = () => {
		navigate("/create");
	};

	return (
		<div className="p-4 max-w-5xl w-full mx-auto">
			<CreateTestModal />

			{/* Radio Picker */}
			<div className="flex justify-center my-4">
				<div role="tablist" className="tabs tabs-bordered">
					{tabs.map((tab) => (
						<a
							role="tab"
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`tab ${
								activeTab === tab.id ? "tab-active" : ""
							}`}
						>
							{tab.label}
						</a>
					))}
				</div>
			</div>

			{/* Conditionally Render Flashcards or Folders */}
			{activeTab === "flashcards" ? (
				// User Flashcard Sets Section
				<div className="p-4 max-w-5xl w-full mx-auto">
					<div className="flex justify-between w-5/6 mx-auto py-3">
						<h2 className="text-3xl mb-4">Your Flashcard Sets</h2>

						<input
							type="text"
							placeholder="Search for set"
							value={searchQuery} // Controlled input
							onChange={(e) => setSearchQuery(e.target.value)} // Update query on change
							className="input input-bordered w-full max-w-xs"
						/>

						<button
							onClick={handleNavigate}
							className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 hover:scale-105 duration-150"
						>
							Create new Set
						</button>
					</div>

					<div className="max-w-5xl w-full space-y-3">
						<AnimatePresence>
							{filteredSets && filteredSets.length > 0 ? (
								filteredSets.map((set: FlashcardSet) => (
									<motion.div
										key={set.ID}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										transition={{ duration: 0.3 }}
									>
										<ListItem set={set} />
									</motion.div>
								))
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="text-center text-gray-500 mt-4"
								>
									No searches found ☹️
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			) : activeTab === "folders" ? (
				// User Folders Section
				<div className="p-4 max-w-5xl w-full mx-auto">
					<div className="flex justify-between w-5/6 mx-auto py-3">
						<h2 className="text-3xl mb-4">Your Folders</h2>

						<AddFolderModal onFolderAdd={handleAddFolder} />
					</div>

					<div className="max-w-5xl w-full space-y-3">
						{user?.Folders.map((folder: Folder) => (
							<div
								key={folder.ID}
								className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
								onClick={() =>
									navigate(`/folders/${folder.ID}`)
								} // Navigate on click
							>
								<h3>{folder.Name}</h3>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="p-4 max-w-5xl w-full mx-auto">
					<div className="flex justify-between w-5/6 mx-auto py-3">
						<h2 className="text-3xl mb-4">Your Tests</h2>

						<AddFolderModal onFolderAdd={handleAddFolder} />
					</div>

					<div className="max-w-5xl w-full space-y-3">
						{user?.Tests.map((test: Test) => (
							<div
								key={test.ID}
								className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
								onClick={() =>
									navigate(`/tests/${test.ID}/questions`)
								} // Navigate on click
							>
								<h3>
									test opens:{" "}
									{new Date(
										test.StartDate
									).toLocaleDateString()}
								</h3>

								<h3>
									test is due to:{" "}
									{new Date(
										test.DueDate
									).toLocaleDateString()}
								</h3>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default Users;
