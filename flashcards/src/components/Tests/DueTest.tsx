import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
import { Test } from "../../types/interfaces"; // Assuming Test is defined here

interface DueTestProps {
	test: Test;
}

const DueTest: React.FC<DueTestProps> = ({ test }) => {
	const navigate = useNavigate();

	return (
		<div className="w-96 h-72 bg-white rounded-lg overflow-hidden border-2 border-black">
			<div className="flex flex-col h-full">
				<div className="flex-grow p-4">
					<h2 className="text-xl text-start font-semibold">
						Due Test
					</h2>
					<div className="text-start">
						<p>
							Test opens:{" "}
							{new Date(test.StartDate).toLocaleDateString()}
						</p>
						<p>
							Test is due to:{" "}
							{new Date(test.DueDate).toLocaleDateString()}
						</p>
					</div>
				</div>

				<button
					className="bg-black text-white py-4 flex items-center justify-center"
					onClick={() => {
						navigate(`/tests/${test.ID}/questions`);
					}}
				>
					<span className="font-semibold">Take a test!</span>
				</button>
			</div>
		</div>
	);
};

export default DueTest;
