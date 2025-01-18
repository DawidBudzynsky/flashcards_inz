import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
import { Test, User } from "../../types/interfaces"; // Assuming Test is defined here
import { useMutation } from "@tanstack/react-query";
import { deleteTestByID } from "../../requests/test";

interface YourTestProp {
	test: Test;
}

const YourTest: React.FC<YourTestProp> = ({ test }) => {
	const navigate = useNavigate();

	const { mutate: deleteTest } = useMutation({
		mutationFn: () => deleteTestByID(test.ID),
		onSuccess: () => {
			alert("Test deleted successfully.");
		},
		onError: (error: any) => {
			console.error("Error deleting test:", error);
			alert(
				`Failed to delete test: ${
					error?.message || "An unexpected error occurred."
				}`
			);
		},
	});

	const handleDelete = async () => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this set?"
		);
		if (confirmation) {
			deleteTest();
		}
	};

	const handleCopyLink = () => {
		const shareLink = `http://localhost:5173/tests/testToken?token=${test.AccessToken}`;
		navigator.clipboard
			.writeText(shareLink)
			.then(() => {
				alert("Link copied to clipboard!");
			})
			.catch((error) => {
				console.error("Failed to copy link:", error);
				alert("Failed to copy link. Please try again.");
			});
	};

	return (
		<div className="flex flex-col h-72 bg-white rounded-lg overflow-hidden border-2 border-black transition-all duration-300 ease-in-out`">
			<div className="flex justify-between p-4">
				<h2 className="flex-2 text-xl text-start font-semibold">
					Your Test
				</h2>

				<div className="flex-1 px-8 flex justify-around">
					<p className="text-lg font-semibold">Share this test:</p>
					<p className="text-lg font-semibold">{test.AccessToken}</p>
					<button
						className="text-xl font-semibold underline"
						onClick={handleCopyLink}
					>
						Copy to clipboard
					</button>
				</div>
				<button
					className="flex-2 flex underline justify-around font-semibold text-xl"
					onClick={handleDelete}
				>
					Delete
				</button>
			</div>

			<div className={"flex flex-grow gap-4 p-4"}>
				<div className="flex-3 text-start">
					<p>
						Test opens:{" "}
						{new Date(test.StartDate).toLocaleDateString()}
					</p>
					<p>
						Test is due to:{" "}
						{new Date(test.DueDate).toLocaleDateString()}
					</p>
				</div>
				<h1>Assigned users:</h1>
				<div className="flex-1 text-center">
					{test.AssignedUsers.map((user: User) => (
						<p>{user.Email}</p>
					))}
				</div>
			</div>

			<button
				className=" bg-black text-white py-4 flex items-center justify-center"
				onClick={() => {
					navigate(`/tests/${test.ID}/questions`);
				}}
			>
				<span className="font-semibold">Take a test!</span>
			</button>
		</div>
	);
};

export default YourTest;
