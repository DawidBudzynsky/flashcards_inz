import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
import { Test, User } from "../../types/interfaces"; // Assuming Test is defined here
import { useMutation } from "@tanstack/react-query";
import { deleteTestByID } from "../../requests/test";
import { IoDocumentAttach } from "react-icons/io5";

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
		<div className="collapse collapse-arrow join-item bg-base rounded-box border-[1px]">
			<input type="radio" name="test-accordion" />

			<div className="collapse-title text-xl font-medium flex items-center justify-start">
				<IoDocumentAttach className="mr-4 text-3xl" />
				<span className="mr-4">{test.DueDate || "Test Details"} </span>
			</div>

			<div className="collapse-content p-0">
				<div className="flex flex-col md:h-72 bg-base overflow-hidden border-[1px] transition-all duration-300 ease-in-out">
					<div className="md:flex justify-between p-4">
						<h2 className="md:flex-2 text-xl text-start font-semibold">
							Your Test
						</h2>

						<div className="md:flex-1 md:flex justify-around text-start">
							<p className="text-lg font-semibold">
								Share this test:
							</p>
							<p className="text-lg font-semibold hidden md:block">
								{test.AccessToken}
							</p>
							<button
								className="text-xl font-semibold underline"
								onClick={handleCopyLink}
							>
								Copy to clipboard
							</button>
						</div>
						<button
							className="md:flex-2 flex underline justify-around font-semibold text-xl"
							onClick={handleDelete}
						>
							Delete
						</button>
					</div>

					<div className={"md:flex md:flex-grow gap-4 p-4"}>
						<div className="md:flex-3 text-start">
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
						<div className="md:flex-1 text-center">
							{test.AssignedUsers.map((user: User) => (
								<div className="text-underline">
									<button
										className="underline text-blue-500"
										key={user.Email}
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
						className=" bg-base-content text-white py-4 md:flex items-center justify-center"
						onClick={() => {
							navigate(`/tests/${test.ID}/questions`);
						}}
					>
						<span className="font-semibold">Take a test!</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default YourTest;
