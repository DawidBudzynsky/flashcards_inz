import React, { useState } from "react";
import FlashcardInput from "../components/FlashcardInput";

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

    const addFlashcard = () => {
        setFlashcards([...flashcards, { question: "", answer: "" }]);
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

    const sendCreateRequest = async () => {
        try {
            const setResponse = await fetch("/flashcards_sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: setName,
                    description: setDescription,
                    // NOTE: here change it
                    folder_id: null, // Replace with the actual folder ID if applicable
                    user_id: 42,  // Replace with the actual user ID if needed
                }),
            });

            if (!setResponse.ok) {
                throw new Error("Failed to create flashcard set");
            }

            const createdSet = await setResponse.json();
            const flashcardSetId = createdSet.id; // Assuming the backend responds with the ID

            // Step 2: Create the flashcards
            const flashcardsResponse = await fetch("/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    flashcards.map((card) => ({
                        flashcard_set_id: flashcardSetId,
                        question: card.question,
                        answer: card.answer,
                    }))
                ),
            });

            if (!flashcardsResponse.ok) {
                throw new Error("Failed to create flashcards");
            }

            alert("Flashcard set and flashcards created successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to create flashcard set and flashcards. Please try again.");
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Flashcard Set Name and Description */}
            <div className="mb-8 p-4 bg-blue-900 text-white rounded-lg">
                <div className="mb-4">
                    <label htmlFor="setName" className="block text-lg font-medium mb-2">
                        Flashcard Set Name
                    </label>
                    <input
                        type="text"
                        id="setName"
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                        className="block w-full px-4 py-2 text-sm bg-transparent border-b-2 border-gray-300 text-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter the name of the set"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="setDescription"
                        className="block text-lg font-medium mb-2"
                    >
                        Flashcard Set Description
                    </label>
                    <textarea
                        id="setDescription"
                        value={setDescription}
                        onChange={(e) => setSetDescription(e.target.value)}
                        className="block w-full px-4 py-2 text-sm bg-transparent border-b-2 border-gray-300 text-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter a brief description of the set"
                        rows={3}
                        required
                    />
                </div>
            </div>

            {/* Flashcard Input Fields */}
            {flashcards.map((flashcard, index) => (
                <FlashcardInput
                    key={index}
                    index={index}
                    flashcard={flashcard}
                    handleInputChange={handleInputChange}
                />
            ))}

            {/* Add Flashcard Button */}
            <div className="flex justify-evenly p-4 mt-6 border border-gray-300 rounded-lg">
                <button
                    onClick={addFlashcard}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add More
                </button>
                <button
                    onClick={sendCreateRequest}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default FlashCardSetForm;

