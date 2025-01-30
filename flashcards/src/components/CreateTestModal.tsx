import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FlashcardSet } from "../types/interfaces";
import { useUserData } from "../hooks/userData";
import { createTest } from "../requests/test";
import CreateButton from "./Buttons/CreateButton";
import ListItem from "./ListItem";
import { notificationContext } from "../utils/notifications";
import { MAX_TEST_DESCRIPTION, MAX_TEST_TITLE } from "../utils/constants";
import { closeModal } from "../utils/modals";

const CreateTestModal: React.FC = () => {
	const [selectedSets, setSelectedSets] = useState<FlashcardSet[]>([]);
	const [title, setTitle] = useState<string>(""); // State for the number picker
	const [description, setDescription] = useState<string>(""); // State for the number picker
	const [startDate, setStartDate] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [numQuestions, setNumQuestions] = useState<number>(1); // State for the number picker
	const { flashcardSets } = useUserData();

	const availableSets = flashcardSets.filter(
		(set: FlashcardSet) =>
			!selectedSets.some((selectedSet) => selectedSet.ID === set.ID)
	);

	const queryClient = useQueryClient();

	const handleAddSet = (set: FlashcardSet) => {
		if (
			selectedSets.length < 5 &&
			!selectedSets.find((s) => s.ID === set.ID)
		) {
			setSelectedSets((prev) => [...prev, set]);
		} else if (selectedSets.length >= 5) {
			notificationContext.notifyWarning(
				"You can only select up to 5 sets."
			);
		}
	};

	const handleRemoveSet = (id: number) => {
		setSelectedSets((prev) => prev.filter((set) => set.ID !== id));
	};

	const { mutate } = useMutation({
		mutationFn: (data: {
			SetIDs: number[];
			StartDate: string;
			Title: string;
			Description: string;
			DueDate: string;
			NumQuestions: number;
		}) => createTest(data),
		onSuccess: () => {
			notificationContext.notifySuccess("Test created successfully!");
			queryClient.invalidateQueries({ queryKey: ["tests"] });
		},
		onError: () => {
			notificationContext.notifyError("Unable to create test");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const requestData = {
			SetIDs: selectedSets.map((set) => set.ID),
			StartDate: startDate,
			Title: title,
			Description: description,
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
				className=""
			/>
			<dialog id="create_test_modal" className="modal">
				<form
					onSubmit={handleSubmit}
					className="modal-box w-full h-3/5 md:max-w-5xl"
				>
					<div className="md:flex gap-8">
						{/* Left side */}
						<div className="flex-1">
							<h3 className="font-bold text-lg mb-4">
								Create New Test
							</h3>

							<div className="gap-5 bg-base h-full rounded-lg border-base border-[1px]">
								<p className="font-bold text-sm pb-2">
									Sets used for test:
								</p>
								{/* Flashcards count */}
								{selectedSets.length > 0 && (
									<div className="text-sm">
										Total flashcards: {totalFlashcards}
									</div>
								)}

								{/* Selected Sets */}
								<ul className="space-y-2">
									{selectedSets.length > 0 ? (
										selectedSets.map(
											(set: FlashcardSet) => (
												<div
													key={set.ID}
													className="flex items-center relative"
												>
													<ListItem
														set={set}
														small={true}
													/>
													<button
														onClick={() =>
															handleRemoveSet(
																set.ID
															)
														}
														className="absolute right-10 bottom-0 px-2 py-2 rounded-xl border-[1px] bg-base-300 text-xs"
													>
														Remove
													</button>
												</div>
											)
										)
									) : (
										<p className="text-sm">
											No sets selected yet.
										</p>
									)}
								</ul>
							</div>
						</div>
						{/* Right side */}
						<div className="md:w-1/3">
							<div className="mb-4">
								<label className="font-semibold mb-2">
									Title of Test
								</label>
								<input
									type="text"
									className="input input-bordered w-full"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									maxLength={MAX_TEST_TITLE}
								/>
							</div>
							<div className="mb-4">
								<label className="font-semibold mb-2">
									Description
								</label>
								<input
									type="text"
									className="input input-bordered w-full"
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									required
									maxLength={MAX_TEST_DESCRIPTION}
								/>
							</div>

							<div className="flex">
								<div className="mb-4">
									<label className="font-semibold mb-2">
										Set Start Date
									</label>
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
									<label className="font-semibold mb-2">
										Set Due Date
									</label>
									<input
										type="date"
										className="input input-bordered w-full"
										value={dueDate}
										onChange={(e) =>
											setDueDate(e.target.value)
										}
										required
									/>
								</div>
							</div>

							{/* Number Picker */}
							<div className="mb-4">
								<label className="font-semibold mb-2">
									Number of Questions
								</label>
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

							<div className="dropdown md:dropdown-left dropdown-top w-full relative">
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
								onClick={() => {
									closeModal("create_test_modal");
								}}
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
