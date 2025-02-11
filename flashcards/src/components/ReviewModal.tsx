import React, { useState } from "react";
import {
	FlashcardReviewRequest,
	sendFlashcardReview,
} from "../requests/flashcard";
import { useMutation } from "@tanstack/react-query";
import { Flashcard, Tracking } from "../types/interfaces";
import { notificationContext } from "../utils/notifications";
import { closeModal } from "../utils/modals";
import { dateToString } from "../utils/showDate";

interface ReviewModalProps {
	flashcard: Flashcard;
	onTrackingUpdate: (updatedTracking: Tracking) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
	flashcard,
	onTrackingUpdate,
}) => {
	const [rating, setRating] = useState<number>(0);

	const { mutate } = useMutation({
		mutationFn: (data: FlashcardReviewRequest) => sendFlashcardReview(data),
		onSuccess: (data) => {
			onTrackingUpdate(data);
			notificationContext.notifySuccess(
				`GREAT JOB, next review date: ${dateToString(
					data.NextReviewDue
				)}🔥`
			);
		},
		onError: () => {
			notificationContext.notifyError(
				"There was an error submitting your review. Please try again."
			);
		},
	});

	const handleRatingChange = (value: number) => {
		setRating(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (rating === 0) {
			notificationContext.notifyWarning(
				"Please select a rating before submitting."
			);
			return;
		}

		const payload: FlashcardReviewRequest = {
			CardID: flashcard.ID,
			Quality: rating,
		};

		mutate(payload);
		closeModal("review_modal");
	};

	return (
		<dialog id="review_modal" className="modal">
			<form onSubmit={handleSubmit} className="modal-box">
				<h3 className="font-bold text-lg">Rate This Flashcard</h3>
				<p className="py-4">
					Please rate the quality of this flashcard based on your
					experience. From left (very bad) to right (very good).
				</p>

				<div className="rating flex justify-center">
					{[1, 2, 3, 4, 5, 6].map((value) => (
						<input
							key={value}
							type="radio"
							name="rating"
							className="mask mask-star-2 bg-orange-400"
							onChange={() => handleRatingChange(value)}
							checked={rating === value}
						/>
					))}
				</div>

				<div className="modal-action mt-4">
					<button type="submit" className="btn btn-primary w-full">
						Submit Review
					</button>
				</div>
			</form>
			<form method="dialog" className="modal-backdrop">
				<button className="btn">Close</button>
			</form>
		</dialog>
	);
};

export default ReviewModal;
