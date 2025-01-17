import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTestModal from "./flashcards/src/components/CreateTestModal";
import ListItem from "./flashcards/src/components/ListItem";
export function PresentationComponent({
	tab,
	setActiveTab,
	activeTab,
	searchQuery,
	e,
	setSearchQuery,
	handleNavigate,
	filteredSets,
	set,
	FlashcardSet,
	handleAddFolder,
	user,
	Folders,
	map,
	folder,
	Folder,
	navigate,
	Tests,
	test,
	Test,
}) {
	return (
		<>
			{" "}
			<div className="p-4 max-w-5xl w-full mx-auto">
				{/* Conditionally Render Flashcards or Folders */}
				{activeTab === "flashcards" ? ( // User Flashcard Sets Section
					<div className="p-4 max-w-5xl w-full mx-auto">
						<div className="flex justify-between w-5/6 mx-auto py-3">
							<h2 className="text-3xl mb-4">
								Your Flashcard Sets
							</h2>

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
											initial={{
												opacity: 0,
												y: -10,
											}}
											animate={{
												opacity: 1,
												y: 0,
											}}
											exit={{
												opacity: 0,
												y: 10,
											}}
											transition={{
												duration: 0.3,
											}}
										>
											<ListItem set={set} />
										</motion.div>
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
				) : activeTab === "folders" ? ( // User Folders Section
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
		</>
	);
}
