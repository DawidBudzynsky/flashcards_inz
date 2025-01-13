import React, { useEffect, useState } from "react";
import FlashcardInput from "../components/FlashcardInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FlashcardSetRequest, createFlashcardSet, getFlashcardSetByID, updateFlashcardSetByID } from "../requests/flashcardset";
import { FlashcardsDataRequest, FlashcardsDataUpdateRequest, createFlashcards, updateFlashcards } from "../requests/flashcard";
import { useParams, useNavigate } from 'react-router-dom';
import { Flashcard } from "../types/interfaces";


const FlashCardSetForm: React.FC = () => {
    const navigate = useNavigate();
    const { setId: setID } = useParams<{ setId: string }>();

    const [folderId, setFolderId] = useState<number | null>(null);

    const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);
    const [setName, setSetName] = useState("");
    const [setDescription, setSetDescription] = useState("");
    const [flashcards, setFlashcards] = useState([
        { id: 0, question: "", answer: "" }
    ]);

    const { data: existingSet, status: fetchStatus } = useQuery({
        queryKey: ["flashcardSet", setID],
        queryFn: () => getFlashcardSetByID(setID!),
        enabled: !!setID,
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const inFolder = params.get('inFolder');
        if (inFolder) {
            setFolderId(Number(inFolder));
        }
    }, [location]);

    useEffect(() => {
        if (existingSet) {
            setSetName(existingSet.Title);
            setSetDescription(existingSet.Description);

            const mappedFlashcards = (existingSet.Flashcards || []).map((flashcard: Flashcard) => ({
                id: flashcard.ID,
                question: flashcard.Question,
                answer: flashcard.Answer
            }))

            setFlashcards(mappedFlashcards.length > 0 ? mappedFlashcards : [{ id: "", question: "", answer: "" }]);
        }
    }, [existingSet]);

    const addFlashcard = () => {
        const newCardIndex = flashcards.length;
        setFlashcards([...flashcards, { id: 0, question: "", answer: "" }]);
        setRecentlyAdded(newCardIndex);
        setTimeout(() => setRecentlyAdded(null), 100);
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
        mutationFn: (data: FlashcardSetRequest) => createFlashcardSet(data, folderId),
        onSuccess: (createdSet) => {
            console.log("FlashcardSet created successfully!");

            const flashcardsData = flashcards.map((card) => ({
                flashcard_set_id: createdSet.ID,
                question: card.question,
                answer: card.answer,
            }));

            createFlashcardsMutation.mutate(flashcardsData);

            navigate(`/flashcards_sets/${createdSet.ID}`)
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

    const { mutate: updateSetMutate } = useMutation({
        mutationFn: (data: { setID: string, body }) => updateFlashcardSetByID(data.setID, data.body),
        onSuccess: (updatedSet) => {

            console.log("FlashcardSet updated successfully!");

            // If any flashcards were updated, we need to update them too
            // const flashcardsData = flashcards.map((card) => ({
            //     id: card.id,
            //     flashcard_set_id: updatedSet.ID,
            //     question: card.question,
            //     answer: card.answer,
            // }));
            // updateFlashcardsMutation.mutate(flashcardsData);

            navigate(`/flashcards_sets/${updatedSet.ID}`);
        },
        onError: (error: any) => {
            console.error("Error updating flashcardSet:", error);
        },
    });

    ////TODO: remember
    //const updateFlashcardsMutation = useMutation({
    //    mutationFn: (data: FlashcardsDataUpdateRequest[]) => updateFlashcards(data),
    //
    //    onSuccess: () => {
    //        console.log("Flashcards updated successfully.");
    //        alert("Flashcard set and flashcards updated successfully!");
    //    },
    //    onError: (error: any) => {
    //        console.error("Error updating flashcards:", error);
    //        alert("Failed to update flashcards.");
    //    },
    //});

    const handleSubmit = () => {
        if (!setName || !setDescription) {
            alert("Please provide a set name and description.");
            return;
        }
        // Trigger the mutation for creating the flashcard set

        const payload = {
            title: setName,
            description: setDescription,
            folder_id: null,
            flashcards: flashcards.map((card) => ({
                id: card.id || 0,
                question: card.question,
                answer: card.answer,
            })),
        };

        if (setID) {
            updateSetMutate({
                setID: setID,
                body: payload
            })
        } else {
            mutate({
                title: setName,
                description: setDescription,
                folder_id: null,
            });

        }
    };


    if (fetchStatus === "error") {
        return <div>Error loading data. Please try again later.</div>; // Show error message
    }

    return (
        <div className="p-4 max-w-5xl w-5/6 mx-auto">
            <div className="max-w-5xl w-5/6 mx-auto flex justify-between">
                <h3 className="text-4xl font-bold">{setID ? "Edit Your Set" : "Create Your New Set"}</h3>

                <div className="space-x-5">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => navigate(-1)}
                    >
                        {setID ? "Cancel" : "Back"}
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        {setID ? "Update" : "Create"}
                    </button>
                </div>
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
                    className={`transition-transform transform ${recentlyAdded === index ? "scale-105 opacity-100" : "opacity-90"} duration-300`}
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

