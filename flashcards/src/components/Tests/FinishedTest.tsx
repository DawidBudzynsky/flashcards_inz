import React from "react";
import { Test } from "../../types/interfaces"; // Assuming Test is defined here
import { dateToString } from "../../utils/showDate";

interface FinishedTestProps {
	test: Test;
}

const FinishedTest: React.FC<FinishedTestProps> = ({ test }) => {
	return (
		<div className="w-96 h-72 bg-white rounded-lg overflow-hidden border-2 border-grey-500">
			<div className="flex flex-col h-full">
				<div className="flex-grow p-4">
					<h2 className="text-xl text-start font-semibold">
						Test Finished
					</h2>
					<div className="text-start">
						<p>Test opens: {dateToString(test.StartDate)}</p>
						<p>Test is due to: {dateToString(test.DueDate)}</p>
					</div>
				</div>

				<button className="bg-gray-500 text-white py-4 flex items-center justify-center">
					<span className="font-semibold" onClick={() => {}}>
						See the results!
					</span>
				</button>
			</div>
		</div>
	);
};

export default FinishedTest;
