import React from "react";
import { useNavigate } from "react-router-dom";
import { FlashcardSet } from "../types/interfaces";
import { dateToString } from "../utils/showDate";
import { useDrag } from "react-dnd";
import { PiCardsThreeFill } from "react-icons/pi";

interface ListItemProps {
	set: FlashcardSet;
}

const ListItem: React.FC<ListItemProps> = ({ set }) => {
	const navigate = useNavigate();
	const [{ isDragging }, dragRef] = useDrag(() => ({
		type: "flashcard-set",
		item: { id: set.ID },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	return (
		<div
			ref={dragRef}
			className={`modal-box max-w-5xl mx-auto bg-base-200 rounded-box cursor-pointer hover:scale-95 ${
				isDragging ? "opacity-30" : "opacity-100"
			}`}
			onClick={() => navigate(`/flashcards_sets/${set.ID}`)} // Navigate on click
		>
			<div className="flex justify-between text-opacity-25">
				<PiCardsThreeFill />
				<p>{set.Flashcards ? set.Flashcards.length : 0} items</p>
				<p>created at: {dateToString(set.CreatedAt)}</p>
			</div>

			<p className="text-2xl font-medium">{set.Title}</p>
		</div>
	);
};

export default ListItem;
