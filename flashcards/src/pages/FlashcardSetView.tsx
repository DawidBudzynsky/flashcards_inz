import { useParams, useNavigate } from "react-router-dom";
import {
	deleteSetByID,
	getFlashcardSetByID,
	toggleSetVisibility,
} from "../requests/flashcardset";
import { Flashcard } from "../types/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dateToString } from "../utils/showDate";
import { toggleFlashcardTracking } from "../requests/flashcard";
import { notificationContext } from "../utils/notifications";

const FlashcardSetView: React.FC = () => {
	const navigate = useNavigate();
	const { setId: setID } = useParams<{ setId: string }>();

	const { data: data, isLoading } = useQuery({
		queryKey: ["flashcardSet", setID],
		queryFn: () => getFlashcardSetByID(setID!),
	});

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

	const handleToggleVisibility = async () => {
		toggleSetPrivate();
	};

	const { mutate: toggleSetPrivate } = useMutation({
		mutationFn: () => toggleSetVisibility(setID!),
		onSuccess: () => {
			notificationContext.notifySuccess("Visibility changed");
		},
		onError: (error: any) => {
			console.error("Error toggling private status:", error);
			alert("Failed to toggle private status.");
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

	const { mutate: toggleTracking } = useMutation({
		mutationFn: (cardID: number) => toggleFlashcardTracking(cardID),
		onSuccess: (_, cardID) => {
			if (data.set?.Flashcards) {
				data.set.Flashcards = data.set.Flashcards.map(
					(flashcard: Flashcard) =>
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!data || !data.set) {
		return <div>Error: Flashcard set not found.</div>;
	}

	return (
		<div className="md:max-w-5xl w-full mx-auto space-y-6">
			<div className="w-screen md:max-w-5xl flex flex-col justify-center">
				<div className="md:max-w-5xl w-full mx-auto md:flex justify-between">
					<h1 className="text-4xl font-bold">{data.set?.Title}</h1>
					<span className="text-sm text-gray-600">
						Created: {dateToString(data.set?.CreatedAt)}
					</span>
				</div>

				<div className="md:flex justify-start">
					<span>Description: {data.set?.Description}</span>
				</div>
			</div>

			<div className="flex md:w-3/4 mx-auto mb-4 gap-4">
				<button className="btn flex-1" onClick={handleLearning}>
					Learn
				</button>
				<button className="btn flex-1">Track all</button>

				{data.isOwner ? (
					<>
						<button className="btn flex-1" onClick={handleEdit}>
							Edit
						</button>
						<button className="btn flex-1" onClick={handleDelete}>
							Remove
						</button>
					</>
				) : (
					<></>
				)}
			</div>

			<hr className="border-gray-300 my-4"></hr>

			<div className="flex justify-between">
				<h1 className="text-xl font-bold">Flashcards in this set:</h1>
				<div className="flex items-center gap-2">
					{data.isOwner && (
						<>
							<span>Private: </span>
							<input
								type="checkbox"
								className="toggle hover:bg-blue-700 my-auto"
								checked={Boolean(data.set?.IsPrivate)}
								onChange={handleToggleVisibility}
							/>
						</>
					)}
				</div>
			</div>

			<div className="">
				{data?.set.Flashcards.map(
					(flashcard: Flashcard, index: number) => (
						<div className="modal-box max-w-7xl w-full rounded-3xl space-y-5">
							<div className="flex justify-between">
								<div>Card {index + 1}</div>
							</div>

							{data.isOwner && (
								<div className="absolute top-4 right-4">
									<span>tracking:</span>
									<input
										type="checkbox"
										className="checkbox checkbox-primary"
										checked={Boolean(flashcard.Tracking)}
										value={index}
										onChange={() =>
											handleTracking(flashcard.ID)
										}
									/>
								</div>
							)}

							<div className="flex justify-between md:space-x-24">
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
					)
				)}
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
