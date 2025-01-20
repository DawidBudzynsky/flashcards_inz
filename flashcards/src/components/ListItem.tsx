import React from "react";
import { useNavigate } from "react-router-dom";
import { FlashcardSet } from "../types/interfaces";
import { dateToString } from "../utils/showDate";
import { useDrag } from "react-dnd";
import { PiCardsThreeFill } from "react-icons/pi";

interface ListItemProps {
	set: FlashcardSet;
	small?: boolean; // Make small optional
}

const ListItem: React.FC<ListItemProps> = ({ set, small = false }) => {
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
			className={`modal-box flex justify-start max-w-7xl mx-auto bg-base-200 rounded-box cursor-pointer hover:scale-95 ${
				isDragging ? "opacity-30" : "opacity-100"
			}`}
			onClick={() => navigate(`/flashcards_sets/${set.ID}`)} // Navigate on click
		>
			<div
				className={`flex justify-start ${
					small ? "text-3xl" : "text-6xl"
				} pr-4 my-auto`}
			>
				<PiCardsThreeFill />
			</div>
			<div className="flex-2 text-start text-opacity-25">
				{/* Conditionally render the details */}
				{!small && (
					<>
						<p>
							{set.Flashcards ? set.Flashcards.length : 0} items
						</p>
						<p>created at: {dateToString(set.CreatedAt)}</p>
					</>
				)}
				<p className={`${small ? "text-lg" : "text-2xl"} font-medium`}>
					{set.Title}
				</p>
			</div>
		</div>
	);
};

export default ListItem;
