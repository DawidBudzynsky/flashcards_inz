import React from "react";
import { Test } from "../../types/interfaces"; // Assuming Test is defined here
import { dateToString } from "../../utils/showDate";
import { useQuery } from "@tanstack/react-query";
import { seeResults } from "../../requests/test";

interface FinishedTestProps {
	test: Test;
}

const FinishedTest: React.FC<FinishedTestProps> = ({ test }) => {
	const {
		data: results,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["test_result", test.ID],
		queryFn: () => seeResults(test.ID),
	});

	const handleSeeResults = () => {
		if (results) {
			console.log("Test Results:", results);
		} else {
			console.log("Results not yet available.");
		}
	};

	return (
		<div className="w-full h-72 bg-base-1 rounded-lg overflow-hidden border-[1px] border-grey-500">
			<div className="flex flex-col h-full">
				<div className="flex-grow p-4">
					<h2 className="text-3xl text-start font-semibold">
						{test.Title}
					</h2>
					<div className="text-start">
						<p>Test opens: {dateToString(test.StartDate)}</p>
						<p>Test is due to: {dateToString(test.DueDate)}</p>
						<p className="font-bold text-2xl">
							Result: {results?.Score}/{test.NumQuestions}
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="bg-gray-500 text-white py-4 flex items-center justify-center">
						<span className="font-semibold">
							Loading Results...
						</span>
					</div>
				) : isError ? (
					<div className="bg-red-500 text-white py-4 flex items-center justify-center">
						<span className="font-semibold">
							Error Loading Results
						</span>
					</div>
				) : (
					<button
						className="bg-gray-500 text-white py-4 flex items-center justify-center"
						onClick={handleSeeResults}
						disabled={true}
					>
						<span className="font-semibold">Test Finished!</span>
					</button>
				)}
			</div>
		</div>
	);
};

export default FinishedTest;
