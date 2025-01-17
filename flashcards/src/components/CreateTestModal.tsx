import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FlashcardSet } from "../types/interfaces";
import { useUserData } from "../hooks/userData";
import { createTest } from "../requests/test";
import CreateButton from "./Buttons/CreateButton";

const CreateTestModal: React.FC = () => {
	const [selectedSets, setSelectedSets] = useState<FlashcardSet[]>([]);
	const [startDate, setStartDate] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [numQuestions, setNumQuestions] = useState<number>(1); // State for the number picker
	const { flashcardSets } = useUserData();

	const availableSets = flashcardSets.filter(
		(set: FlashcardSet) =>
			!selectedSets.some((selectedSet) => selectedSet.ID === set.ID)
	);

	const handleAddSet = (set: FlashcardSet) => {
		if (
			selectedSets.length < 5 &&
			!selectedSets.find((s) => s.ID === set.ID)
		) {
			setSelectedSets((prev) => [...prev, set]);
		} else if (selectedSets.length >= 5) {
			alert("You can only select up to 5 sets.");
		}
	};

	const handleRemoveSet = (id: number) => {
		setSelectedSets((prev) => prev.filter((set) => set.ID !== id));
	};

	const { mutate } = useMutation({
		mutationFn: (data: {
			SetIDs: number[];
			StartDate: string;
			DueDate: string;
			NumQuestions: number;
		}) => createTest(data),
		onSuccess: () => {
			console.log("Test created successfully!");
		},
		onError: (error: any) => {
			console.error("Error creating test:", error);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const requestData = {
			SetIDs: selectedSets.map((set) => set.ID),
			StartDate: startDate,
			DueDate: dueDate,
			NumQuestions: numQuestions,
		};

		mutate(requestData);
	};

	const totalFlashcards = selectedSets.reduce(
		(total, set: FlashcardSet) => total + (set.Flashcards.length || 0),
		0
	);

	return (
		<>
			<CreateButton
				title={"Create new Test"}
				modal_id={"create_test_modal"}
			/>
			<dialog id="create_test_modal" className="modal">
				<form
					onSubmit={handleSubmit}
					className="modal-box w-11/12 max-w-5xl h-1/2 max-h-xl"
				>
					<div className="grid grid-cols-2 gap-8">
						{/* Left side */}
						<div>
							<h3 className="font-bold text-lg mb-4">
								Create New Test
							</h3>

							<div className="gap-5 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-md">
								<p className="font-bold text-sm pb-2">
									Sets used for test:
								</p>
								{/* Flashcards count */}
								{selectedSets.length > 0 && (
									<div className="mt-4 text-sm text-gray-700">
										<p>
											Total flashcards: {totalFlashcards}
										</p>
									</div>
								)}

								{/* Selected Sets */}
								<ul className="space-y-2">
									{selectedSets.length > 0 ? (
										selectedSets.map(
											(set: FlashcardSet) => (
												<li
													key={set.ID}
													className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-all transform scale-95 opacity-100 duration-500 ease-in-out"
												>
													<div className="flex w-full justify-between items-center">
														{/* Left Side: Title */}
														<span className="font-medium text-gray-700">
															{set.Title}
														</span>

														{/* Right Side: Created Date and Flashcard Count */}
														<div className="flex text-gray-300 font-medium justify-end ml-4 space-x-4 text-sm">
															<p>
																no.:{" "}
																{
																	set
																		.Flashcards
																		.length
																}
															</p>
															<p>
																{new Date(
																	set.CreatedAt
																).toLocaleDateString()}
															</p>
														</div>
													</div>
													<button
														type="button"
														className="btn btn-xs btn-error"
														onClick={() =>
															handleRemoveSet(
																set.ID
															)
														}
													>
														Remove
													</button>
												</li>
											)
										)
									) : (
										<p className="text-sm text-gray-500">
											No sets selected yet.
										</p>
									)}
								</ul>
							</div>
						</div>
						{/* Right side */}
						<div>
							<div className="mb-4">
								<h4 className="font-semibold mb-2">
									Set Start Date
								</h4>
								<input
									type="date"
									className="input input-bordered w-full"
									value={startDate}
									onChange={(e) =>
										setStartDate(e.target.value)
									}
									required
								/>
							</div>

							<div className="mb-4">
								<h4 className="font-semibold mb-2">
									Set Due Date
								</h4>
								<input
									type="date"
									className="input input-bordered w-full"
									value={dueDate}
									onChange={(e) => setDueDate(e.target.value)}
									required
								/>
							</div>

							{/* Number Picker */}
							<div className="mb-4">
								<h4 className="font-semibold mb-2">
									Number of Questions
								</h4>
								<input
									type="number"
									className="input input-bordered w-full"
									min={1}
									max={totalFlashcards}
									value={numQuestions}
									onChange={(e) =>
										setNumQuestions(
											Math.min(
												Math.max(1, +e.target.value),
												totalFlashcards
											)
										)
									}
									required
								/>
							</div>

							<div className="dropdown dropdown-bottom w-full relative">
								<div
									tabIndex={0}
									className="btn btn-outline w-full"
								>
									Pick Sets
								</div>
								<ul
									tabIndex={0}
									className="dropdown-content menu block bg-base-100 rounded-box absolute top-full mt-2 z-[100] w-full max-h-60 overflow-y-auto shadow-lg"
								>
									{availableSets.length > 0 ? (
										availableSets.map(
											(set: FlashcardSet) => (
												<li key={set.ID}>
													<a
														onClick={() =>
															handleAddSet(set)
														}
														className="transition-focus transform scale-95 opacity-100 hover:bg-gray-200 duration-300 cursor-pointer"
													>
														{set.Title}
													</a>
												</li>
											)
										)
									) : (
										<p className="text-sm text-gray-500">
											No available sets left.
										</p>
									)}
								</ul>
							</div>

							<button
								type="submit"
								className="btn btn-primary w-full mt-6"
							>
								Create Test
							</button>
						</div>
					</div>
				</form>
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</>
	);
};

export default CreateTestModal;
