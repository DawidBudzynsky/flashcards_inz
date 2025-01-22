import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Test } from "../../types/interfaces";
import { dateToString } from "../../utils/showDate";

import { getTestStatus, TestStatus } from "../../utils/testStatusUtils";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

interface DueTestProps {
	test: Test;
}

const DueTest: React.FC<DueTestProps> = ({ test }) => {
	const navigate = useNavigate();
	const [testStatus, setTestStatus] = useState<TestStatus>("Waiting");
	const [countdown, setCountdown] = useState<string>("");

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
		const interval = setInterval(updateStatus, 1000); // Update every second
		return () => clearInterval(interval);
	}, [test.StartDate, test.DueDate]);

	return (
		<div className="w-full h-72 bg-base rounded-lg overflow-hidden border-[1px]">
			<div className="flex flex-col h-full">
				<div className="flex-grow p-4">
					<div className="text-xl flex text-start font-semibold">
						Due Test
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

					<div className="text-start">
						<p>Test opens: {dateToString(test.StartDate)}</p>
						<p>Test is due to: {dateToString(test.DueDate)}</p>
					</div>
				</div>

				<button
					className={`bg-black text-white py-4 flex items-center justify-center ${
						testStatus === "Open"
							? "cursor-pointer"
							: "cursor-not-allowed"
					}`}
					onClick={() => {
						if (testStatus === "Open") {
							navigate(`/tests/${test.ID}/questions`);
						}
					}}
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
	);
};

export default DueTest;
