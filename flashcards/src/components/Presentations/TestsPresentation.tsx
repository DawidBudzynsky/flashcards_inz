import { useQuery } from "@tanstack/react-query";
import { Test } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import CreateTestModal from "../CreateTestModal";
import { assignTest, getUserTests } from "../../requests/test";
import { useState } from "react";

const TestsPresentation: React.FC = () => {
	const navigate = useNavigate();
	interface response {
		finished: Test[];
		not_finished: Test[];
	}

	const { data: tests } = useQuery<response>({
		queryKey: ["tests"],
		queryFn: getUserTests,
		// staleTime: 1000 * 60 * 5,
	});

	const [testToken, setTestToken] = useState<string>("");

	// Handle token submission
	const handleAddTest = (testToken: string) => {
		assignTest(testToken);
	};

	// Handle pasting the token
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedToken = e.clipboardData.getData("Text");
		setTestToken(pastedToken);
		handleAddTest(pastedToken);
	};

	// Handle pressing the Enter key
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleAddTest(testToken);
		}
	};

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTestToken(e.target.value); // Update the token value
	};
	return (
		<div className="p-4 max-w-5xl w-full mx-auto">
			<div className="flex justify-between w-5/6 mx-auto py-3">
				<h2 className="text-3xl mb-4">Your Tests</h2>

				<input
					type="text"
					placeholder="Redeem a token for a test"
					className="input input-bordered w-full max-w-xs"
					value={testToken}
					onChange={handleChange}
					onPaste={handlePaste} // Handle paste event
					onKeyDown={handleKeyPress} // Handle Enter key event
				/>
				<CreateTestModal />
			</div>

			<div className="max-w-5xl w-full space-y-3">
				<h3 className="text-3xl font-bold">Not finished tests</h3>
				{tests?.not_finished.map((test: Test) => (
					<div
						key={test.ID}
						className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
						onClick={() => navigate(`/tests/${test.ID}/questions`)} // Navigate on click
					>
						<h3>author:{test.UserGoogleID}</h3>
						<h3>test id:{test.ID}</h3>
						<h3>
							test opens:{" "}
							{new Date(test.StartDate).toLocaleDateString()}
						</h3>

						<h3>
							test is due to:{" "}
							{new Date(test.DueDate).toLocaleDateString()}
						</h3>
					</div>
				))}
				<h3 className="text-3xl font-bold">Finished tests</h3>
				{tests?.finished.map((test: Test) => (
					<div
						key={test.ID}
						className="modal-box max-w-5xl mx-auto bg-base-200 rounded-box p-4 cursor-pointer"
						onClick={() => navigate(`/tests/${test.ID}/questions`)} // Navigate on click
					>
						<h3>
							test opens:{" "}
							{new Date(test.StartDate).toLocaleDateString()}
						</h3>

						<h3>
							test is due to:{" "}
							{new Date(test.DueDate).toLocaleDateString()}
						</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default TestsPresentation;
