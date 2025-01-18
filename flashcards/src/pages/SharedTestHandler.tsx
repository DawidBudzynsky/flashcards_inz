import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { assignTest } from "../requests/test";

const SharedTestHandler = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	// Use `useQuery` to fetch test data using the token
	const { data, isLoading, error } = useQuery({
		queryKey: ["testassign", token], // Include the token in the query key
		queryFn: () => assignTest(token), // Pass a function to the queryFn
		enabled: !!token, // Only run query if the token exists
		onSuccess: (data) => {
			console.log("Test successfully assigned:", data);

			// Redirect to the test page
			navigate(`/tests/${data.id}/`);
		},
		onError: (err) => {
			console.error("Error processing shared test:", err);
			alert("An error occurred. Please try again later.");
		},
	});

	// Handle loading and error states
	if (isLoading) {
		return <div>Processing your test...</div>;
	}

	if (error) {
		return <div>Error loading test. Please try again later.</div>;
	}

	return null; // No need to render anything if successful
};

export default SharedTestHandler;
