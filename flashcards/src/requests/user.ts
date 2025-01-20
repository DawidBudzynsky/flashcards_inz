import api from "../api/api";
import { User } from "../types/interfaces";

export const getUser = async (): Promise<User> => {
	return await api.get("/users/me");
};
export const getUserByID = async (userID: string): Promise<User> => {
	return await api.get(`/users/${userID}`);
};

export const toggleUserVisibility = async () => {
	const url = `/users/toggle_visibility`;
	return await api.put(url);
};
