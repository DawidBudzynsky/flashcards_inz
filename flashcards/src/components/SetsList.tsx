import { FlashcardSet } from "../types/interfaces";
import FlashcardSetComponent from "./flashcardSet";
import { useNavigate, useParams } from "react-router-dom";

interface SetsListProp {
	sets: FlashcardSet[];
}
const SetsList: React.FC<SetsListProp> = ({ sets }) => {
	const navigate = useNavigate();
	const { folderId: folderId } = useParams<{ folderId: string }>();

	const handleCreateNewSet = () => {
		navigate(`/create?inFolder=${folderId}`);
	};
	return (
		<div className="modal-box w-11/12 max-w-3xl">
			<div className="flex justify-between py-3">
				<h3 className="font-bold text-lg mb-4 flex-1">
					Available Sets
				</h3>
				<button className="btn flex-1" onClick={handleCreateNewSet}>
					Create new set for this folder
				</button>
			</div>

			{sets && sets.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{sets.map((set: FlashcardSet) => (
						<div key={set.ID} className="flex justify-center">
							<FlashcardSetComponent flashcardSet={set} />
						</div>
					))}
				</div>
			) : (
				<div className="text-center text-gray-500">
					No sets available
				</div>
			)}
		</div>
	);
};

export default SetsList;
