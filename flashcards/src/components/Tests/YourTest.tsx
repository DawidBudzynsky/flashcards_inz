import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Test, User } from "../../types/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTestByID } from "../../requests/test";
import {
	IoCheckmarkCircleOutline,
	IoDocumentAttach,
	IoTrashBin,
} from "react-icons/io5";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { FaLink } from "react-icons/fa";

import { dateToString } from "../../utils/showDate";
import { notificationContext } from "../../utils/notifications";
import { getTestStatus, TestStatus } from "../../utils/testStatusUtils";

interface YourTestProp {
	test: Test;
}

const YourTest: React.FC<YourTestProp> = ({ test }) => {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState<string>("");
	const [testStatus, setTestStatus] = useState<TestStatus>("Waiting");
	const [_, setSocket] = useState<WebSocket | null>(null);
	const queryClient = useQueryClient();

	const { mutate: deleteTest } = useMutation({
		mutationFn: () => deleteTestByID(test.ID),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			notificationContext.notifySuccess("Test deleted successfully.");
		},
		onError: (error: any) => {
			console.error("Error deleting test:", error);
			notificationContext.notifyError(
				`Failed to delete test: ${
					error?.message || "An unexpected error occurred."
				}`
			);
		},
	});

	useEffect(() => {
		const updateStatus = () => {
			const { status, countdown } = getTestStatus(
				test.StartDate,
				test.DueDate
			);
			setTestStatus(status);
			setCountdown(countdown);
		};

		updateStatus();
		const interval = setInterval(updateStatus, 1000);
		return () => clearInterval(interval);
	}, [test.StartDate, test.DueDate]);

	const handleDelete = async () => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this set?"
		);
		if (confirmation) {
			deleteTest();
		}
	};

	const handleTakeTest = () => {
		if (testStatus === "Open") {
			const socketConnection = new WebSocket(
				`ws://localhost:8080/ws?userID=${test.ID}`
			);

			socketConnection.onopen = () => {
				console.log("WebSocket connection established");
			};

			socketConnection.onmessage = (event) => {
				console.log("Message from server:", event.data);
			};

			socketConnection.onclose = () => {
				console.log("WebSocket connection closed");
			};

			setSocket(socketConnection);

			navigate(`/tests/${test.ID}/questions`);
		}
	};

	const handleCopyLink = () => {
		const shareLink = `http://localhost:5173/tests/testToken?token=${test.AccessToken}`;
		navigator.clipboard
			.writeText(shareLink)
			.then(() => {
				notificationContext.notifySuccess("Link copied to clipboard!");
			})
			.catch((error) => {
				notificationContext.notifyError(
					"Failed to copy link. Please try again."
				);
			});
	};

	return (
		<div className="collapse collapse-arrow join-item bg-base rounded-box border-[1px]">
			<input type="radio" name="test-accordion" />

			<div className="collapse-title text-xl font-medium flex items-center justify-start">
				<IoDocumentAttach className="mr-4 text-3xl" />
				<span className="mr-4">{test.Title || "Test Details"} </span>
				<span className="ml-auto flex text-sm gap-2 font-semibold">
					<span className="my-auto">{testStatus}</span>
					{testStatus === "Open" && (
						<IoCheckmarkCircleOutline className="text-3xl bg-green-600 rounded-full" />
					)}
					{testStatus === "Waiting" && (
						<HiOutlineExclamationCircle className="text-3xl bg-orange-500 rounded-full" />
					)}
					{testStatus === "Closed" && (
						<HiOutlineExclamationCircle className="text-3xl bg-red-600 rounded-full" />
					)}
				</span>
			</div>

			<div className="collapse-content p-0">
				<div className="flex flex-col md:h-72 bg-base border-[1px] transition-all duration-300 ease-in-out">
					<div className="md:flex justify-between p-4">
						<h2 className="md:flex-2 text-xl text-start font-semibold">
							{test.Title || "Your Test"}
						</h2>

						<div className="md:flex-1 md:flex justify-around text-start">
							<p className="text-lg font-semibold hidden md:block">
								{test.AccessToken}
							</p>
						</div>
						<div className="flex gap-4 mx-auto">
							<div
								className="tooltip tooltip-left my-auto"
								data-tip="Copy Link for Test"
							>
								<button
									className="text-2xl font-semibold"
									onClick={handleCopyLink}
								>
									<FaLink />
								</button>
							</div>

							<button
								className="md:flex-2 flex my-auto font-semibold text-2xl tooltip tooltip-left"
								data-tip="Delete the set"
								onClick={handleDelete}
							>
								<IoTrashBin />
							</button>
						</div>
					</div>

					<div className={"md:flex md:flex-grow gap-4 p-4"}>
						<div className="md:flex-3 text-start">
							<p>Test opens: {dateToString(test.StartDate)}</p>
							<p>Test is due to: {dateToString(test.DueDate)}</p>
						</div>

						<h1>Assigned users:</h1>
						<div className="md:flex-1 text-center">
							{test.AssignedUsers.map((user: User) => (
								<div
									className="text-underline"
									key={user.Email}
								>
									<button
										className="underline text-blue-500"
										onClick={() =>
											navigate(`/users/${user.google_id}`)
										}
									>
										{user.Username}
									</button>
								</div>
							))}
						</div>
					</div>

					<button
						className={`bg-base-content text-white py-4 md:flex items-center justify-center ${
							testStatus === "Open"
								? "cursor-pointer"
								: "cursor-not-allowed"
						}`}
						onClick={handleTakeTest}
						disabled={testStatus !== "Open"}
					>
						<span className="font-semibold">
							{testStatus === "Open"
								? "Take a test!"
								: countdown || testStatus}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default YourTest;
