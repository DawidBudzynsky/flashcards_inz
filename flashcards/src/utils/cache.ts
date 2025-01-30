import { useQueryClient } from "@tanstack/react-query";

export const getCachedValue = (key: string) => {
	const queryClient = useQueryClient();
	const cachedValue = queryClient.getQueryData([key]);
	return cachedValue;
};
