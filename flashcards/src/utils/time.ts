import { Test } from "../types/interfaces";

export const calculateTimeDifference = (nextReviewDue: string) => {
	const now = new Date();
	const nextReviewDate = new Date(nextReviewDue);
	const diffInMilliseconds = now.getTime() - nextReviewDate.getTime();
	const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays > 0) {
		return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
	} else if (diffInHours > 0) {
		return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
	} else if (diffInMinutes > 0) {
		return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
	} else {
		return `Just now`;
	}
};

export const calculateCountdown = (
	test: Test,
	setCountdown: React.Dispatch<React.SetStateAction<string>>,
	setIsTestOpen: React.Dispatch<React.SetStateAction<boolean>>
): void => {
	const now = new Date();
	const startDate = new Date(test.StartDate);
	const dueDate = new Date(test.DueDate);

	if (now < startDate) {
		const diff = startDate.getTime() - now.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		setCountdown(`${hours}h ${minutes}m ${seconds}s`);
		setIsTestOpen(false);
	} else if (now >= startDate && now <= dueDate) {
		setCountdown("");
		setIsTestOpen(true);
	} else {
		setCountdown("");
		setIsTestOpen(false);
	}
};
