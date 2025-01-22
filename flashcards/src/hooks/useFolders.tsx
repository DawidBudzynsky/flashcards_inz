import { useQuery } from "@tanstack/react-query";
import { getUserFolders } from "../requests/folder";
import { Folder } from "../types/interfaces";

const useFolders = () => {
	const { data, error, isLoading, refetch } = useQuery<Folder[]>({
		queryKey: ["folders"],
		queryFn: getUserFolders,
	});

	return {
		folders: data,
		isLoading,
		error,
		refetch,
	};
};

export default useFolders;
