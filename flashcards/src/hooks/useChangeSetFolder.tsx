import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSetFolder } from "../requests/folder";

interface ChangeSetFolderData {
	flashcardSetId: number;
	oldFolderId: number | null;
	folderId: number;
}

const useChangeSetFolder = (oldFolderId: number | null) => {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: (data: ChangeSetFolderData) =>
			changeSetFolder(data.flashcardSetId, oldFolderId, data.folderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
		onError: (error) => {
			console.error("Error appending flashcard set to folder:", error);
		},
	});

	return { changeSetFolder: mutate };
};

export default useChangeSetFolder;
