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
