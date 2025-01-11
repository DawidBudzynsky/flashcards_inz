import { FlashcardSet } from "../types/interfaces"
import FlashcardSetComponent from "./flashcardSet"

interface SetsListProp {
    sets: FlashcardSet[]
}
const SetsList: React.FC<SetsListProp> = ({ sets }) => {
    return (
        <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Available Sets</h3>
            {sets && sets.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {/* Rendering each flashcard set */}
                    {sets.map((set: FlashcardSet) => (
                        <div key={set.ID} className="flex justify-center">
                            <FlashcardSetComponent flashcardSet={set} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">No sets available</div>
            )}
        </div>
    )
}

export default SetsList;
