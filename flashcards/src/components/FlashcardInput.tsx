import React from "react";
import { Flashcard } from "../types/interfaces";

interface FlashcardInputs {
	id: number;
	question: string;
	answer: string;
}

interface FlashcardInputProps {
	index: number;
	flashcard: FlashcardInputs;
	handleInputChange: (
		index: number,
		type: "question" | "answer",
		value: string
	) => void;
	handleDelete: (index: number) => void;
}

const FlashcardInput: React.FC<FlashcardInputProps> = ({
	index,
	flashcard,
	handleInputChange,
	handleDelete,
}) => {
	return (
		<div className="modal-box max-w-7xl w-full rounded-3xl space-y-5">
			<div className="flex justify-between">
				<div className="text-lg font-bold">
					Card number: {index + 1}
				</div>
				<button
					className="btn btn-sm btn-circle hover: bg-red-500"
					onClick={() => handleDelete(index)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div className="flex justify-between md:space-x-24 pb-5">
				<div className="form-control w-full">
					<input
						className="input input-bordered w-full"
						type="text"
						id={`question_${index}`}
						name={`question_${index}`}
						placeholder="Question"
						value={flashcard.question}
						onChange={(e) =>
							handleInputChange(index, "question", e.target.value)
						}
						required
					/>
				</div>
				<div className="form-control w-full">
					<input
						className="input input-bordered w-full"
						type="text"
						id={`answer_${index}`}
						name={`answer_${index}`}
						placeholder="Answer"
						value={flashcard.answer}
						onChange={(e) =>
							handleInputChange(index, "answer", e.target.value)
						}
						required
					/>
				</div>
			</div>
		</div>
	);
};

export default FlashcardInput;
