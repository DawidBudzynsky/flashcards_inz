import React, { useState } from "react";
import FlashcardInput from "../components/FlashcardInput";
import { useMutation } from "@tanstack/react-query";
import { FlashcardSetRequest, createFlashcardSet } from "../requests/flashcardset";
import { FlashcardsDataRequest, createFlashcards } from "../requests/flashcard";

interface Flashcard {
    question: string;
    answer: string;
}

const FlashCardSetForm: React.FC = () => {
    const [setName, setSetName] = useState("");
    const [setDescription, setSetDescription] = useState("");
    const [flashcards, setFlashcards] = useState<Flashcard[]>([
        { question: "", answer: "" },
    ]);
    const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

    const addFlashcard = () => {
        const newCardIndex = flashcards.length;
        setFlashcards([...flashcards, { question: "", answer: "" }]);
        setRecentlyAdded(newCardIndex); // Track the newly added card index
        setTimeout(() => setRecentlyAdded(null), 100); // Remove the animation state after 1s
    };

    const removeFlashcard = (indexToRemove: number) => {
        setFlashcards(flashcards.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChange = (
        index: number,
        type: "question" | "answer",
        value: string
    ) => {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards[index][type] = value;
        setFlashcards(updatedFlashcards);
    };

    // Initialize useMutation for the API call
    const { mutate } = useMutation({
        mutationFn: (data: FlashcardSetRequest) => createFlashcardSet(data),
        onSuccess: (createdSet) => {
            console.log("FlashcardSet created successfully!");

            const flashcardsData = flashcards.map((card) => ({
                flashcard_set_id: createdSet.ID,
                question: card.question,
                answer: card.answer,
            }));

            createFlashcardsMutation.mutate(flashcardsData);
        },
        onError: (error: any) => {
            console.error("Error creating flashcardSet:", error);
        },
    });

    const createFlashcardsMutation = useMutation({
        mutationFn: (data: FlashcardsDataRequest[]) => createFlashcards(data),
        onSuccess: () => {
            console.log("Flashcards created successfully.");
            alert("Flashcard set and flashcards created successfully!");
        },
        onError: (error: any) => {
            console.error("Error creating flashcards:", error);
            alert("Failed to create flashcards.");
        },
    });

    const handleSubmit = () => {
        if (!setName || !setDescription) {
            alert("Please provide a set name and description.");
            return;
        }
        // Trigger the mutation for creating the flashcard set
        mutate({
            title: setName,
            description: setDescription,
            folder_id: null,
        });
    };

    return (
        <div className="p-4 max-w-5xl w-5/6 mx-auto">
            <div className="max-w-5xl w-5/6 mx-auto flex justify-between">
                <h3 className="text-4xl font-bold">Create your new set!</h3>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Create
                </button>
            </div>

            <div className="modal-box max-w-5xl mx-auto w-full rounded-lg">
                <div className="my-4">
                    <div className="space-y-5">
                        <input
                            type="text"
                            id="setName"
                            value={setName}
                            onChange={(e) => setSetName(e.target.value)}
                            required
                            placeholder="Enter the name of the set"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="text"
                            id="setDescription"
                            value={setDescription}
                            onChange={(e) => setSetDescription(e.target.value)}
                            required
                            placeholder="Description of a set"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Flashcard Input Fields */}
            {flashcards.map((flashcard, index) => (
                <div
                    key={index}
                    className={`transition-transform transform ${recentlyAdded === index ? "scale-105 opacity-100" : "opacity-90"
                        } duration-300`}
                >
                    <FlashcardInput
                        index={index}
                        flashcard={flashcard}
                        handleDelete={removeFlashcard}
                        handleInputChange={handleInputChange}
                    />
                </div>
            ))}

            {/* Add Flashcard Button */}
            <div className="modal-box max-w-5xl w-full rounded-3xl space-y-5">
                <button
                    onClick={addFlashcard}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add More
                </button>
            </div>
        </div>
    );
};

export default FlashCardSetForm;

