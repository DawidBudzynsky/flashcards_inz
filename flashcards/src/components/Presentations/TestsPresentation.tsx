import { useQuery } from "@tanstack/react-query";
import { Test } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import CreateTestModal from "../CreateTestModal";
import { assignTest, getUserTests } from "../../requests/test";
import { useState } from "react";
import DueTest from "../Tests/DueTest";
import FinishedTest from "../Tests/FinishedTest";
import YourTest from "../Tests/YourTest";

const TestsPresentation: React.FC = () => {
	const navigate = useNavigate();
	interface response {
		finished: Test[];
		not_finished: Test[];
		yours: Test[];
	}

	const { data: tests } = useQuery<response>({
		queryKey: ["tests"],
		queryFn: getUserTests,
	});

	const [testToken, setTestToken] = useState<string>("");

	const handleAddTest = (testToken: string) => {
		assignTest(testToken);
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedToken = e.clipboardData.getData("Text");
		setTestToken(pastedToken);
		handleAddTest(pastedToken);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleAddTest(testToken);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTestToken(e.target.value);
	};

	return (
		<div className="flex flex-col p-4 max-w-5xl w-full mx-auto">
			<div className="flex justify-between w-5/6 mx-auto py-3">
				<h2 className="text-3xl mb-4">Your Tests</h2>
				<input
					type="text"
					placeholder="Redeem a token for a test"
					className="input input-bordered w-full max-w-xs"
					value={testToken}
					onChange={handleChange}
					onPaste={handlePaste}
					onKeyDown={handleKeyPress}
				/>
				<CreateTestModal />
			</div>

			<h3 className="text-3xl font-bold">Yours</h3>
			<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
				<div className="join join-vertical w-full">
					{tests?.yours.map((test: Test) => (
						<YourTest test={test} />
					))}
				</div>
			</div>

			<h3 className="text-3xl font-bold">Not finished tests</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{tests?.not_finished.map((test: Test) => (
					<DueTest test={test} />
				))}
			</div>

			<h3 className="text-3xl font-bold">Finished tests</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{tests?.finished.map((test: Test) => (
					<FinishedTest test={test} />
				))}
			</div>
		</div>
	);
};

export default TestsPresentation;
