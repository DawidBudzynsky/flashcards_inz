import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrag } from "react-dnd";
import { FlashcardSet } from "../../types/interfaces";
import { dateToString } from "../../utils/showDate";
import { PiCardsThreeFill } from "react-icons/pi";

interface ListItemProps {
	set: FlashcardSet;
}

const SetItem: React.FC<ListItemProps> = ({ set }) => {
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
			className={`cursor-pointer join-item hover:border-[4px] border-[1px] p-4 ${
				isDragging ? "opacity-30" : "opacity-100"
			}`}
			onClick={() => navigate(`/flashcards_sets/${set.ID}`)} // Navigate on click
		>
			<div className="flex justify-between text-opacity-25">
				<PiCardsThreeFill />
				<p>created at: {dateToString(set.CreatedAt)}</p>
			</div>

			<p className="text-2xl font-medium">{set.Title}</p>
		</div>
	);
};

export default SetItem;
