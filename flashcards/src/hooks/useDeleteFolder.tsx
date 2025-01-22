import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolderByID } from "../requests/folder";
import { notificationContext } from "../utils/notifications";

const useDeleteFolder = (folderId: string) => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: () => deleteFolderByID(folderId!),
		onSuccess: () => {
			notificationContext.notifySuccess("Folder deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
		onError: (error: any) => {
			console.error("Error deleting folder:", error);
			notificationContext.notifyError(
				`Failed to delete folder: ${
					error?.message || "An unexpected error occurred."
				}`
			);
		},
	});
	return {
		deleteFolder: mutate,
	};
};
export default useDeleteFolder;
