import { useParams, useNavigate } from "react-router-dom";
import { deleteSetByID, getFlashcardSetByID } from "../requests/flashcardset";
import { Flashcard } from "../types/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dateToString } from "../utils/showDate";
import { toggleFlashcardTracking } from "../requests/flashcard";

const FlashcardSetView: React.FC = () => {
	const navigate = useNavigate();
	const { setId: setID } = useParams<{ setId: string }>();

	const { data: set } = useQuery({
		queryKey: ["flashcardSet", setID],
		queryFn: () => getFlashcardSetByID(setID!),
	});

	// Mutation to delete the set
	const { mutate: deleteSet } = useMutation({
		mutationFn: () => deleteSetByID(setID!),
		onSuccess: () => {
			alert("Set deleted successfully.");
			navigate(-1);
		},
		onError: (error: any) => {
			console.error("Error deleting set:", error);
			alert(
				`Failed to delete set: ${
					error?.message || "An unexpected error occurred."
				}`
			);
		},
	});

	const handleDelete = async () => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this set?"
		);
		if (confirmation) {
			deleteSet();
		}
	};

	const handleEdit = () => {
		navigate(`/flashcards_sets/${setID}/edit`);
	};

	const handleLearning = () => {
		navigate(`/flashcards_sets/${setID}/learn`);
	};

	console.log(set?.Flashcards);

	const { mutate: toggleTracking } = useMutation({
		mutationFn: (cardID: number) => toggleFlashcardTracking(cardID),
		onSuccess: (_, cardID) => {
			if (set?.Flashcards) {
				set.Flashcards = set.Flashcards.map((flashcard: Flashcard) =>
					flashcard.ID === cardID
						? { ...flashcard, Tracking: !flashcard.Tracking }
						: flashcard
				);
			}
		},
		onError: (error: any) => {
			console.error("Error toggling tracking:", error);
		},
	});

	const handleTracking = (cardID: number) => {
		toggleTracking(cardID);
	};

	return (
		<div className="p-4 max-w-5xl w-5/6 mx-auto space-y-6">
			<div className="w-screen max-w-5xl flex flex-col justify-center">
				<div className="max-w-5xl w-5/6 mx-auto flex justify-between">
					<h1 className="text-4xl font-bold">{set?.Title}</h1>
					<span className="text-sm text-gray-600">
						Created: {dateToString(set?.CreatedAt)}
					</span>
				</div>

				<div className="flex justify-start ps-24">
					<span>Description: {set?.Description}</span>
				</div>
			</div>

			<div className="flex w-3/4 mx-auto mb-4 gap-4">
				<button className="btn flex-1" onClick={handleLearning}>
					Learn
				</button>
				<button className="btn flex-1">Track all</button>
				<button className="btn flex-1" onClick={handleEdit}>
					Edit
				</button>
				<button className="btn flex-1" onClick={handleDelete}>
					Remove
				</button>
			</div>

			<hr className="border-gray-300 my-4"></hr>

			<h1 className="text-xl font-bold">Flashcards in this set:</h1>
			<div className="">
				{set?.Flashcards.map((flashcard: Flashcard, index: number) => (
					<div className="modal-box max-w-7xl w-full rounded-3xl space-y-5">
						<div className="flex justify-between">
							<div>Card {index + 1}</div>
						</div>

						<div className="absolute top-4 right-4">
							<span>tracking:</span>
							<input
								type="checkbox"
								className="checkbox checkbox-primary"
								checked={Boolean(flashcard.Tracking)}
								value={index}
								onChange={() => handleTracking(flashcard.ID)}
							/>
						</div>

						<div className="flex justify-between space-x-24 pb-5">
							<input
								className="input input-bordered w-full"
								disabled
								type="text"
								placeholder="Question"
								value={flashcard.Question}
							/>
							<input
								className="input input-bordered w-full"
								disabled
								type="text"
								placeholder="Question"
								value={flashcard.Answer}
							/>
						</div>
					</div>
				))}
			</div>

			<button
				className="btn mb-6"
				onClick={() => navigate(-1)} // Go back to the previous page
			>
				Back
			</button>
		</div>
	);
};

export default FlashcardSetView;
