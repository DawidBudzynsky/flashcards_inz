import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editFolder } from "../requests/folder";
import { notificationContext } from "../utils/notifications";

interface FolderData {
	Name: string;
	Description: string;
}

const useEditFolder = () => {
	const queryClient = useQueryClient();

	const { mutate, error, isSuccess } = useMutation({
		mutationFn: ({
			folderId,
			folderData,
		}: {
			folderId: string;
			folderData: FolderData;
		}) => editFolder(folderId, folderData),
		onSuccess: () => {
			notificationContext.notifySuccess("Folder updated successfully");
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
		onError: (error) => {
			console.error("Error editing folder:", error);
		},
	});

	return {
		editFolder: mutate,
		error,
		isSuccess,
	};
};

export default useEditFolder;
