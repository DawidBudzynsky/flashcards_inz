// components/ReviseInfo.tsx
import { PiCardsFill } from "react-icons/pi";
import { Link } from "react-router-dom";

interface ReviseInfoProps {
	setId: string;
	totalFlashcards: number;
}

const ReviseInfo: React.FC<ReviseInfoProps> = ({ setId, totalFlashcards }) => {
	return (
		<Link
			to={`/flashcards_sets/${setId}/learn`}
			className="modal-box flex max-w-7xl w-full rounded-3xl space-x-6"
		>
			<div className="w-1/3 flex justify-center items-center text-6xl">
				<PiCardsFill />
			</div>

			<div className="w-2/3">
				<div className="font-semibold">
					Card to revise in set{" "}
					<span className="text-blue-500 hover:underline">
						{`Set ${setId}`}
					</span>
					<div>
						{totalFlashcards} card{totalFlashcards > 1 ? "s" : ""}{" "}
						to revise
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ReviseInfo;
