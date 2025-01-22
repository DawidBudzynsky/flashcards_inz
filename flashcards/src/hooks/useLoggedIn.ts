import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

const isUserLoggedIn = async () => {
	const url = `check-if-logged-in`;
	return await api.get(url);
};

export const useIsLoggedIn = () => {
	const { data } = useQuery({
		queryKey: ["isUserLoggedIn"],
		queryFn: isUserLoggedIn,
	});

	return {
		isLoggedIn: data,
	};
};
