import api from "../api/api";
import { User } from "../types/interfaces";

export const getUser = async (): Promise<User> => {
	return await api.get("/users/me");
};
