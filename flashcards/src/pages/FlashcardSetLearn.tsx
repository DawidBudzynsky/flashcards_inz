import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFlashcardSetByIdToLearn } from "../requests/flashcardset";
import { useQuery } from "@tanstack/react-query";
import ReviewModal from "../components/ReviewModal.tsx";
import { Flashcard, Tracking } from "../types/interfaces.ts";

const FlashcardSetLearn: React.FC = () => {
	const { setId: setID } = useParams<{ setId: string }>();

	const { data: set } = useQuery({
		queryKey: ["flashcardSet", setID],
		queryFn: () => getFlashcardSetByIdToLearn(setID!),
	});

	const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [scaleDirection, setScaleDirection] = useState<"left" | "right" | "">(
		""
	);
	const [flashcardTimes, setFlashcardTimes] = useState<Map<string, number>>(
		new Map()
	);
	const [isCompleted, setIsCompleted] = useState(false);

	const startTime = useRef<number | null>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === " ") {
				setIsFlipped(!isFlipped);
			} else if (event.key === "ArrowRight") {
				goToNextFlashcard();
			} else if (event.key === "ArrowLeft") {
				goToPreviousFlashcard();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isFlipped, currentFlashcardIndex]);

	const goToPreviousFlashcard = () => {
		if (currentFlashcardIndex > 0) {
			setScaleDirection("left");
			setCurrentFlashcardIndex(currentFlashcardIndex - 1);
			setIsFlipped(false);
			animateBackToNormal();
		}
	};

	const goToNextFlashcard = () => {
		if (!set || currentFlashcardIndex >= set.Flashcards.length - 1) {
			recordTimeSpent();
			setIsCompleted(true);
			return;
		}
		recordTimeSpent();
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const isReviewDue =
			flashcard.Tracking &&
			new Date(flashcard.Tracking.NextReviewDue).setHours(0, 0, 0, 0) ===
				today.getTime();
		if (isReviewDue) {
			const modal = document.getElementById(
				"review_modal"
			) as HTMLDialogElement;
			modal?.showModal();
			modal?.addEventListener(
				"close",
				() => {
					setScaleDirection("right");
					setCurrentFlashcardIndex(currentFlashcardIndex + 1);
					setIsFlipped(false);
					animateBackToNormal();
				},
				{ once: true }
			);
			return;
		}

		setScaleDirection("right");
		setCurrentFlashcardIndex(currentFlashcardIndex + 1);
		setIsFlipped(false);
		animateBackToNormal();
	};

	const recordTimeSpent = () => {
		if (startTime.current) {
			const endTime = Date.now();
			const timeSpent = endTime - startTime.current;
			const flashcard = set?.Flashcards[currentFlashcardIndex];
			if (flashcard) {
				flashcardTimes.set(flashcard.ID, timeSpent);
				setFlashcardTimes(new Map(flashcardTimes));
			}
		}
		startTime.current = Date.now();
	};

	const handleCardClick = () => {
		setIsFlipped(!isFlipped);
	};

	const animateBackToNormal = () => {
		setTimeout(() => {
			setScaleDirection("");
		}, 150); // 150ms for faster transition
	};

	if (!set || !set.Flashcards || set.Flashcards.length === 0) {
		return <div>No flashcards available.</div>;
	}

	const calculateAverageTime = () => {
		const totalTime = Array.from(flashcardTimes.values()).reduce(
			(total, time) => total + time,
			0
		);
		const averageTime = totalTime / flashcardTimes.size;
		return averageTime;
	};

	const flashcard = set.Flashcards[currentFlashcardIndex];

	// Calculate the progress as a percentage
	const progress = (currentFlashcardIndex / set.Flashcards.length) * 100;

	// Handle updated tracking
	const updateFlashcardTracking = (updatedTracking: Tracking) => {
		if (!set || !set.Flashcards) return;

		// Find the flashcard and update its Tracking data
		const updatedFlashcards = set.Flashcards.map((flashcard: Flashcard) =>
			flashcard.ID === updatedTracking.FlashcardID
				? { ...flashcard, Tracking: updatedTracking }
				: flashcard
		);

		// Update the flashcard set with the updated tracking
		set.Flashcards = updatedFlashcards;
	};
	return (
		<div className="md:max-w-5xl w-full mx-auto space-y-6">
			<div className="text-3xl font-bold">{set.Title}</div>

			{isCompleted ? (
				<div className="space-y-4">
					<div className="text-3xl font-bold">Congratulations 🎉</div>
					<div className="flex flex-col text-xl font-semibold">
						Average time spent on flashcard:
						<span>
							{(calculateAverageTime() / 1000).toFixed(2)} seconds
						</span>
					</div>
					<div className="text-xl font-semibold">
						Time Spent on Each Flashcard:
					</div>
					<div className="space-y-2 border-[1px] max-w-sm mx-auto p-2 rounded-3xl">
						{Array.from(flashcardTimes.entries()).map(
							([flashcardID, timeSpent]) => (
								<div
									key={flashcardID}
									className="flex mx-auto max-w-sm gap-8 justify-center auto bg-base"
								>
									<span>Flashcard {flashcardID}:</span>
									<span>
										{(timeSpent / 1000).toFixed(2)} seconds
									</span>
								</div>
							)
						)}
					</div>
				</div>
			) : (
				<>
					<div className="flex justify-center items-center">
						<div
							className={`flip-card relative w-96 h-80 bg-base-200 shadow-lg rounded-lg cursor-pointer transition-transform duration-300 
                    ${
						scaleDirection === "right"
							? "transform translate-x-6"
							: ""
					}
                    ${
						scaleDirection === "left"
							? "transform -translate-x-6"
							: ""
					}
                    ${isFlipped ? "flipped" : ""}`}
							onClick={handleCardClick}
						>
							<div className="flip-card-front absolute inset-0 flex justify-center items-center text-2xl font-semibold">
								{flashcard.Question}
							</div>

							<div className="flip-card-back absolute inset-0 flex justify-center items-center text-2xl font-semibold">
								{flashcard.Answer}
							</div>
						</div>
					</div>

					<div className="grid justify-center mx-auto mt-4 text-lg font-semibold">
						<progress
							className="progress w-56"
							value={progress}
							max="100"
						></progress>
						<span>
							{currentFlashcardIndex + 1} /{" "}
							{set.Flashcards.length}
						</span>
					</div>

					<div className="flex md:w-2/5 mx-auto justify-center space-x-3 mt-4">
						<button
							className="bg-base-300 py-3 px-3 flex-1 rounded hover:bg-gray-300"
							onClick={goToPreviousFlashcard}
							disabled={currentFlashcardIndex === 0}
						>
							{"<"}
						</button>
						<button
							className="bg-base-300 py-3 px-3 flex-1 rounded hover:bg-gray-300"
							onClick={goToNextFlashcard}
							disabled={
								currentFlashcardIndex === set.Flashcards.length
							}
						>
							{">"}
						</button>
					</div>
				</>
			)}
			<ReviewModal
				flashcard={flashcard}
				onTrackingUpdate={updateFlashcardTracking}
			/>
		</div>
	);
};

export default FlashcardSetLearn;
