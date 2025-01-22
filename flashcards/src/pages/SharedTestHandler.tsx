import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignTest } from "../requests/test";
import { notificationContext } from "../utils/notifications";

const SharedTestHandler = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const queryClient = useQueryClient();

	const { mutate, status, error } = useMutation({
		mutationFn: () => assignTest(token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			notificationContext.notifySuccess("Test successfully assigned");
			navigate(`/tests/`);
		},
		onError: (err) => {
			console.error("Error processing shared test:", err);
			notificationContext.notifyWarning(
				"You are already assigned to this test"
			);
			navigate(`/tests/`);
		},
	});

	React.useEffect(() => {
		if (token) {
			mutate();
		}
	}, [token, mutate]);

	if (status == "pending") {
		return <div>Processing your test...</div>;
	}

	if (error) {
		return <div>Error loading test. Please try again later.</div>;
	}
};

export default SharedTestHandler;
