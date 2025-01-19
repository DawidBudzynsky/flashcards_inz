import { PiCardsFill } from "react-icons/pi";
import { Flashcard } from "../../types/interfaces";
import { calculateTimeDifference } from "../../utils/time";

interface SimpleFlashcardProps {
	flashcard: Flashcard;
}

const SimpleFlashcard: React.FC<SimpleFlashcardProps> = ({ flashcard }) => {
	return (
		<li key={flashcard.ID}>
			<div className="modal-box flex max-w-7xl w-full rounded-3xl space-x-6">
				<div className="w-1/3 flex justify-center items-center text-6xl">
					<PiCardsFill />
				</div>

				<div className="w-2/3">
					<div>
						<span>
							{calculateTimeDifference(
								flashcard.Tracking?.NextReviewDue
							)}
						</span>
					</div>

					<div className="font-semibold">
						Card to revise in set{" "}
						<a
							href={`/flashcards_sets/${flashcard.FlashcardSetID}/learn`}
							className="text-blue-500 hover:underline"
						>
							{`Set ${flashcard.FlashcardSetID}`}
						</a>
					</div>
				</div>
			</div>
		</li>
	);
};

export default SimpleFlashcard;
