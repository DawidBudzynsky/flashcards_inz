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

    const sendCreateRequest = async () => {
        try {
            const setResponse = await fetch("http://localhost:8080/flashcards_sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    title: setName,
                    description: setDescription,
                    folder_id: null,
                    // user_id: null,                
                }),
            });

            if (!setResponse.ok) {
                throw new Error("Failed to create flashcard set");
            }

            const createdSet = await setResponse.json();
            // const flashcardSetId = createdSet.ID; // Assuming the backend responds with the ID

            // Step 2: Create the flashcards
            const flashcardsResponse = await fetch("http://localhost:8080/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(
                    flashcards.map((card) => ({
                        flashcard_set_id: createdSet.ID,
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
        <div className="p-4 max-w-4xl w-3/5 mx-auto">
            {/* Flashcard Set Name and Description */}
            <div className="mb-8 p-4 bg-blue-900 text-black rounded-lg">
                <label className="text-lg font-medium mb-2 text-white">Create your new set!</label>
                <div>
                    <div className="mb-4">
                        <input type="text" id="setName" value={setName} onChange={(e) => setSetName(e.target.value)} required placeholder="Enter the name of the set" className="input input-bordered w-full" />
                    </div>
                    <div>
                        <input type="text" id="setDescription" value={setDescription} onChange={(e) => setSetDescription(e.target.value)} required placeholder="Description of a set" className="input input-bordered w-full" />
                    </div>

                    {/* Flashcard Input Fields */}
                    {flashcards.map((flashcard, index) => (
                        <FlashcardInput
                            key={index}
                            index={index}
                            flashcard={flashcard}
                            handleDelete={removeFlashcard}
                            handleInputChange={handleInputChange}
                        />
                    ))}

                </div>
            </div>

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

