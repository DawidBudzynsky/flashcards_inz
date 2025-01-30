import React, { useEffect, useState } from "react";
import FlashcardInput from "../components/FlashcardInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	FlashcardSetRequest,
	createFlashcardSet,
	getFlashcardSetByIdToEdit,
	updateFlashcardSetByID,
} from "../requests/flashcardset";
import { FlashcardsDataRequest, createFlashcards } from "../requests/flashcard";
import { useParams, useNavigate } from "react-router-dom";
import { Flashcard } from "../types/interfaces";
import { notificationContext } from "../utils/notifications";
import { MIN_FLASHCARDS_IN_SET, MIN_QUESTIONS } from "../utils/constants";
import CreateButton from "../components/Buttons/CreateButton";
import TranslateComponent from "../utils/translate";

const FlashCardSetForm: React.FC = () => {
	const navigate = useNavigate();
	const { setId: setID } = useParams<{ setId: string }>();
	const [folderId, setFolderId] = useState<number | null>(null);
	const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);
	const [setName, setSetName] = useState("");
	const [setDescription, setSetDescription] = useState("");
	const [flashcards, setFlashcards] = useState([
		{ id: 0, question: "", answer: "" },
	]);
	const [fromLanguage, setFromLanguage] = useState("en");
	const [chosenLanguage, setChosenLanguage] = useState("pl");

	const { data: existingSet, status: fetchStatus } = useQuery({
		queryKey: ["flashcardSet", setID],
		queryFn: () => getFlashcardSetByIdToEdit(setID!),
		enabled: !!setID,
	});

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const inFolder = params.get("inFolder");
		if (inFolder) {
			setFolderId(Number(inFolder));
		}
	}, [location]);

	useEffect(() => {
		if (existingSet) {
			setSetName(existingSet.Title);
			setSetDescription(existingSet.Description);

			const mappedFlashcards = (existingSet.Flashcards || []).map(
				(flashcard: Flashcard) => ({
					id: flashcard.ID,
					question: flashcard.Question,
					answer: flashcard.Answer,
				})
			);

			setFlashcards(
				mappedFlashcards.length > 0
					? mappedFlashcards
					: [{ id: "", question: "", answer: "" }]
			);
		}
	}, [existingSet]);

	const addFlashcard = () => {
		const newCardIndex = flashcards.length;
		setFlashcards([...flashcards, { id: 0, question: "", answer: "" }]);
		setRecentlyAdded(newCardIndex);
		setTimeout(() => setRecentlyAdded(null), 100);
	};

	const removeFlashcard = (indexToRemove: number) => {
		setFlashcards(flashcards.filter((_, index) => index !== indexToRemove));
	};

	const handleInputChange = (
		index: number,
		type: "question" | "answer",
		value: string
	) => {
		const updatedFlashcards = [...flashcards];
		updatedFlashcards[index][type] = value;
		setFlashcards(updatedFlashcards);
	};

	const { mutate } = useMutation({
		mutationFn: (data: FlashcardSetRequest) =>
			createFlashcardSet(data, folderId),
		onSuccess: (createdSet) => {
			console.log("FlashcardSet created successfully!");

			const flashcardsData = flashcards.map((card) => ({
				flashcard_set_id: createdSet.ID,
				question: card.question,
				answer: card.answer,
			}));

			createFlashcardsMutation.mutate(flashcardsData);

			navigate(`/flashcards_sets/${createdSet.ID}`);
		},
		onError: (error: any) => {
			console.error("Error creating flashcardSet:", error);
		},
	});

	const createFlashcardsMutation = useMutation({
		mutationFn: (data: FlashcardsDataRequest[]) => createFlashcards(data),
		onSuccess: () => {
			notificationContext.notifySuccess(
				"Flashcard set and flashcards created successfully!"
			);
		},
		onError: (error: any) => {
			notificationContext.notifyError("Failed to create flashcards.");
		},
	});

	const { mutate: updateSetMutate } = useMutation({
		mutationFn: (data: { setID: string; body: FlashcardSetRequest }) =>
			updateFlashcardSetByID(data.setID, data.body),
		onSuccess: (updatedSet) => {
			console.log("FlashcardSet updated successfully!");
			notificationContext.notifySuccess(
				"FlashcardSet updated successfully!"
			);
			navigate(`/flashcards_sets/${updatedSet.ID}`);
		},
		onError: (error: any) => {
			console.error("Error updating flashcardSet:", error);
		},
	});

	const handleSubmit = () => {
		if (!setName || !setDescription) {
			notificationContext.notifyWarning(
				"Please provide a set name and description."
			);
			return;
		}

		if (flashcards.length < MIN_FLASHCARDS_IN_SET) {
			notificationContext.notifyWarning(
				`You need to have at least ${MIN_FLASHCARDS_IN_SET} flashcards to create a set.`
			);
			return;
		}

		const payload = {
			title: setName,
			description: setDescription,
			folder_id: null,
			flashcards: flashcards.map((card) => ({
				id: card.id || 0,
				question: card.question,
				answer: card.answer,
			})),
		};

		if (setID) {
			updateSetMutate({
				setID: setID,
				body: payload,
			});
		} else {
			mutate({
				title: setName,
				description: setDescription,
				folder_id: null,
			});
		}
	};

	if (fetchStatus === "error") {
		return <div>Error loading data. Please try again later.</div>;
	}

	return (
		<div className="md:max-w-5xl w-full mx-auto">
			<div className="md:max-w-5xl md:w-5/6 mx-auto md:flex justify-between">
				<h3 className="text-4xl font-bold">
					{setID ? "Edit Your Set" : "Create Your New Set"}
				</h3>

				<div className="space-x-5">
					<CreateButton
						title={`${setID ? "Cancel" : "Back"}`}
						onClick={() => navigate(-1)}
					/>

					<CreateButton
						title={`${setID ? "Update" : "Create"}`}
						onClick={handleSubmit}
					/>
				</div>
			</div>

			<div className="modal-box md:max-w-5xl mx-auto w-full rounded-lg">
				<div className="my-4">
					<div className="space-y-5">
						<input
							type="text"
							id="setName"
							value={setName}
							onChange={(e) => setSetName(e.target.value)}
							required
							placeholder="Enter the name of the set"
							className="input input-bordered w-full"
						/>
						<input
							type="text"
							id="setDescription"
							value={setDescription}
							onChange={(e) => setSetDescription(e.target.value)}
							required
							placeholder="Description of a set"
							className="input input-bordered w-full"
						/>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-center space-x-4">
				<span>Translation From</span>
				<select
					className="select select-bordered"
					value={fromLanguage}
					onChange={(e) => setFromLanguage(e.target.value)}
				>
					<option value="en">English</option>
					<option value="pl">Polish</option>
					<option value="es">Spanish</option>
					{/* Add more language options */}
				</select>
				<span>To</span>
				<select
					className="select select-bordered"
					value={chosenLanguage}
					onChange={(e) => setChosenLanguage(e.target.value)}
				>
					<option value="en">English</option>
					<option value="pl">Polish</option>
					<option value="es">Spanish</option>
					{/* Add more language options */}
				</select>
			</div>

			{flashcards.map((flashcard, index) => (
				<div
					key={index}
					className={`transition-transform transform ${
						recentlyAdded === index
							? "scale-105 opacity-100"
							: "opacity-90"
					} duration-300`}
				>
					<FlashcardInput
						index={index}
						flashcard={flashcard}
						handleDelete={removeFlashcard}
						handleInputChange={handleInputChange}
						fromLanguage={fromLanguage}
						toLanguage={chosenLanguage}
					/>
				</div>
			))}

			<div className="modal-box max-w-5xl w-full rounded-3xl space-y-5">
				<CreateButton title="Add More" onClick={addFlashcard} />
			</div>
		</div>
	);
};

export default FlashCardSetForm;
