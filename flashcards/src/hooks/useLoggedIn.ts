import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

const isUserLoggedIn = async () => {
	const url = `/check-user-logged-in`;
	return await api.get(url);
};

export const useIsLoggedIn = () => {
	const { data, isLoading, isPending, isFetched } = useQuery({
		queryKey: ["isUserLoggedIn"],
		queryFn: isUserLoggedIn,
		retry: false,
	});

	return {
		isLoggedIn: data?.success ?? false,
		isLoading,
		isPending,
		isFetched,
	};
};
