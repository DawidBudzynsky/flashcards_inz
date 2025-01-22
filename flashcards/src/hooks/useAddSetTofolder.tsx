import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appendSetToFolder } from "../requests/folder"; // Adjust the import path
import { FlashcardSet, Folder } from "../types/interfaces";

const useAddSetToFolder = (
	flashcardSet: FlashcardSet,
	folderId: string | undefined
) => {
	const queryClient = useQueryClient();

	const { mutate, error, isSuccess } = useMutation({
		mutationFn: (folderId: number) =>
			appendSetToFolder(flashcardSet.ID, folderId),
		onSuccess: () => {
			queryClient.setQueryData<Folder>(
				["folder", folderId],
				(oldData) => {
					if (!oldData) return oldData;

					const updatedSets = [
						...oldData.FlashcardsSets,
						flashcardSet,
					];

					return { ...oldData, FlashcardsSets: updatedSets };
				}
			);
		},
		onError: (error) => {
			console.error("Error adding set to folder:", error);
		},
	});

	return {
		addSetToFolder: mutate,
		error,
		isSuccess,
	};
};

export default useAddSetToFolder;
