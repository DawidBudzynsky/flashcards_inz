import { useQuery } from "@tanstack/react-query";
import { getUser } from "../requests/user";
import {
	User,
	FlashcardSet,
	Flashcard,
	FlashcardToRevise,
} from "../types/interfaces";
import ListItem from "../components/ListItem";
import { getFlashcardsForToday } from "../requests/flashcard";

const Home: React.FC = () => {
	// Fetch user data using useQuery
	const {
		data: user,
		status: userStatus,
		error: userError,
	} = useQuery<User>({
		queryKey: ["user"],
		queryFn: getUser,
	});

	// Fetch flashcards for today using useQuery
	const {
		data: flashcardsToday,
		isLoading: isFlashcardsLoading,
		isError: isFlashcardsError,
		refetch: refetchFlashcards,
	} = useQuery({
		queryKey: ["flashcards_today"],
		queryFn: getFlashcardsForToday,
		enabled: false, // Disable automatic fetching on component mount
	});

	const calculateTimeDifference = (nextReviewDue: string) => {
		const now = new Date();
		const nextReviewDate = new Date(nextReviewDue);

		const diffInMilliseconds = now.getTime() - nextReviewDate.getTime();
		const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		// Display the time difference in a human-readable format
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

	return (
		<div className="grid  grid-cols-2 p-4 max-w-5xl w-5/6 mx-auto space-x-6">
			{/* Currently Tracked Cards Section */}
			<div className="bg-gray-50 rounded-lg py-4">
				{/* TODO: SHOULD DO THIS IN SEPARETE PAGE */}
				{/* <h1 className="text-3xl font-bold">Currently tracked cards</h1> */}
				{/* {user?.FlashcardsSets.flatMap((set: FlashcardSet) => */}
				{/*     set.Flashcards.filter((flashcard) => flashcard.Tracking) */}
				{/* ).map((trackedFlashcard: Flashcard) => ( */}
				{/*     <div key={trackedFlashcard.ID}> */}
				{/*         <FlashcardComponent flashcard={trackedFlashcard} /> */}
				{/*     </div> */}
				{/* ))} */}

				<h1 className="text-3xl font-bold">Cards To Revise</h1>
				{isFlashcardsLoading && <p>Loading flashcards...</p>}
				{isFlashcardsError && <p>Error fetching flashcards!</p>}
				{flashcardsToday && (
					<ul className="mt-4">
						{flashcardsToday.map((flashcard: FlashcardToRevise) => (
							<li key={flashcard.FlashcardID}>
								<div className="modal-box max-w-7xl w-full rounded-3xl space-y-5">
									<div className="flex justify-end">
										<span>
											{calculateTimeDifference(
												flashcard.NextReviewDue
											)}
										</span>
									</div>
									<div className="font-semibold">
										{
											flashcardsToday.filter(
												(f) =>
													f.Flashcard
														.FlashcardSetID ===
													flashcard.Flashcard
														.FlashcardSetID
											).length
										}
										card to revise in set
										<a
											href={`/flashcards_sets/${flashcard.Flashcard.FlashcardSetID}/learn`}
											className="text-blue-500 hover:underline"
										>
											{`Set ${flashcard.Flashcard.FlashcardSetID}`}{" "}
										</a>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Review Progress Section */}
			<div className="bg-gray-50 rounded-lg py-4 space-y-2.5">
				<h1 className="text-3xl font-bold">Review progress</h1>
				<div
					className="radial-progress"
					style={{
						"--value": "70",
						"--size": "12rem",
						"--thickness": "1rem",
					}}
					role="progressbar"
				>
					70%
				</div>

				<h1 className="text-2xl font-semibold">Favourite Sets</h1>
				<div>
					{user?.FlashcardsSets.slice(0, 3).map(
						(set: FlashcardSet) => (
							<ListItem key={set.ID} set={set} />
						)
					)}
				</div>

				{/* Button to Trigger Flashcards Fetch */}
				<div className="mt-4">
					<button
						className="btn btn-primary"
						onClick={() => refetchFlashcards()}
					>
						Fetch Flashcards for Today
					</button>
				</div>

				{/* Flashcards Data */}
				{isFlashcardsLoading && <p>Loading flashcards...</p>}
				{isFlashcardsError && <p>Error fetching flashcards!</p>}
				{flashcardsToday && (
					<ul className="mt-4">
						{flashcardsToday.map((flashcard: Flashcard) => (
							<li key={flashcard.ID}>
								<strong>Question:</strong> {flashcard.Question}
								<br />
								<strong>Answer:</strong> {flashcard.Answer}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Home;
