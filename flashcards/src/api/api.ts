import axios, { AxiosRequestConfig } from "axios";
import { navigateTo } from "../utils/navigation";

const defaults = {
	baseURL: "http://localhost:8080",
	headers: {
		"Content-Type": "application/json",
	},
	error: {
		code: "INTERNAL_ERROR",
		message:
			"Something went wrong. Please check your internet connection or contact support.",
		status: 503,
		data: {},
	},
};

/**
 * Makes an API request using Axios with the given method and options.
 */
const api = async (method: string, url: string, variables: any = {}) => {
	const fullUrl = `${defaults.baseURL}${url}`;

	const config: AxiosRequestConfig = {
		url: fullUrl,
		method: method as AxiosRequestConfig["method"],
		headers: defaults.headers,
		withCredentials: true,
	};

	if (method === "GET") {
		config.params = variables;
	} else {
		config.data = variables;
	}

	try {
		const response = await axios(config);
		return response.data;
	} catch (error: any) {
		if (error.response.status === 404) {
			navigateTo("/404");
		}
		console.error(`API Error [${method}] ${fullUrl}:`, error);
		if (error.response) {
			throw error.response.data || defaults.error;
		} else {
			throw defaults.error;
		}
	}
};

export default {
	get: (url: string, variables?: any) => api("GET", url, variables),
	post: (url: string, variables?: any) => api("POST", url, variables),
	put: (url: string, variables?: any) => api("PUT", url, variables),
	patch: (url: string, variables?: any) => api("PATCH", url, variables),
	delete: (url: string, variables?: any) => api("DELETE", url, variables),
};
