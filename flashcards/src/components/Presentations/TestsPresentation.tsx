import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Test } from "../../types/interfaces";
import CreateTestModal from "../CreateTestModal";
import { assignTest, getUserTests } from "../../requests/test";
import { useState } from "react";
import DueTest from "../Tests/DueTest";
import FinishedTest from "../Tests/FinishedTest";
import YourTest from "../Tests/YourTest";
import TabNavigation from "../../pages/TabNavigation";
import { notificationContext } from "../../utils/notifications";

const TestsPresentation: React.FC = () => {
	interface response {
		finished: Test[];
		not_finished: Test[];
		yours: Test[];
	}
	const queryClient = useQueryClient();

	const { data: tests } = useQuery<response>({
		queryKey: ["tests"],
		queryFn: getUserTests,
	});

	const [testToken, setTestToken] = useState<string>("");

	const { mutate: addTest } = useMutation({
		mutationFn: assignTest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tests"] });
			notificationContext.notifySuccess("Assigned to test!");
		},
		onError: (error) => {
			notificationContext.notifyError(String(error));
		},
	});

	const handleAddTest = (testToken: string) => {
		addTest(testToken);
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
		<div className="md:px-20 md:max-w-5xl md:mx-auto">
			<TabNavigation />
			<div className="md:flex justify-between py-3">
				<h2 className="text-3xl mb-4">
					Your{" "}
					<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
						Tests
					</span>
				</h2>

				<input
					type="text"
					placeholder="Redeem a token for a test"
					className="input input-bordered w-full max-w-xs mb-4"
					value={testToken}
					onChange={handleChange}
					onPaste={handlePaste}
					onKeyDown={handleKeyPress}
				/>
				<CreateTestModal />
			</div>

			<h3 className="text-3xl font-bold">Yours</h3>
			<div className="md:max-w-5xl w-full space-y-3 mx-auto">
				<div className="join join-vertical md:w-full rounded-3xl">
					{tests?.yours.map((test: Test) => (
						<YourTest key={test.ID} test={test} />
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
