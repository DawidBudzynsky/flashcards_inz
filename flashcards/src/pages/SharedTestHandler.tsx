import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { assignTest } from "../requests/test";

const SharedTestHandler = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const { mutate, isLoading, error } = useMutation({
		mutationFn: () => assignTest(token),
		onSuccess: (data) => {
			console.log("Test successfully assigned:", data);
			navigate(`/users/`);
		},
		onError: (err) => {
			console.error("Error processing shared test:", err);
			alert("An error occurred. Please try again later.");
		},
	});

	React.useEffect(() => {
		if (token) {
			mutate();
		}
	}, [token, mutate]);

	if (isLoading) {
		return <div>Processing your test...</div>;
	}

	if (error) {
		return <div>Error loading test. Please try again later.</div>;
	}
};

export default SharedTestHandler;
