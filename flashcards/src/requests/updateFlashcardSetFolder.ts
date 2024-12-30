export const updateFlashcardSetFolder = async (flashcardSetId: number, folderId: number) => {
    const response = await fetch(`http://localhost:8080/flashcards_sets/${flashcardSetId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            FolderID: folderId
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update flashcard set folder');
    }

    return response.json();
};
