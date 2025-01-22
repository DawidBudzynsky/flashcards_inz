export type TestStatus = "Waiting" | "Open" | "Closed";

export interface StatusResult {
	status: TestStatus;
	countdown: string;
	statusText: string;
}

export const getTestStatus = (
	startDate: string | Date,
	dueDate: string | Date
): StatusResult => {
	const now = new Date();
	const start = new Date(startDate);
	const due = new Date(dueDate);

	if (now < start) {
		const diff = start.getTime() - now.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		return {
			status: "Waiting",
			countdown: `${hours}h ${minutes}m ${seconds}s`,
			statusText: `Test Opens In: ${hours}h ${minutes}m ${seconds}s`,
		};
	}

	if (now >= start && now <= due) {
		return {
			status: "Open",
			countdown: "",
			statusText: "Test is Open!",
		};
	}

	return {
		status: "Closed",
		countdown: "",
		statusText: "Test Has Ended :(",
	};
};
