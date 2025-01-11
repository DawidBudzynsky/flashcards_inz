import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlashcardSet } from "../types/interfaces";
import { dateToString } from "../utils/showDate";

interface ListItemProps {
    set: FlashcardSet; // Explicitly typing the props
}

const ListItem: React.FC<ListItemProps> = ({ set }) => {
    const navigate = useNavigate();

    return (
        <div
            className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer pb-8"
            onClick={() => navigate(`/flashcards_sets/${set.ID}`)} // Navigate on click
        >
            <div className="flex justify-between text-opacity-25">
                <p>{set.Flashcards.length} items</p>
                <p>created at: {dateToString(set.CreatedAt)}</p>
            </div>

            <p className="text-2xl font-medium">{set.Title}</p>
        </div>
    );
};

export default ListItem;

