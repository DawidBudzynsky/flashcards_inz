import { useQuery } from "@tanstack/react-query";
import { getUser } from "../requests/user";
import { getFlashcardsForToday } from "../requests/flashcard";
import { User, FlashcardSet, Flashcard } from "../types/interfaces";
import ListItem from "../components/ListItem";
import ReviseInfo from "../components/Revise/ReviseInfo";

const Home: React.FC = () => {
	// Fetch user data using useQuery
	const { data: user } = useQuery<User>({
		queryKey: ["user"],
		queryFn: getUser,
	});

	// Fetch flashcards for today using useQuery
	const {
		data: flashcardsToday,
		isLoading: isFlashcardsLoading,
		isError: isFlashcardsError,
	} = useQuery({
		queryKey: ["flashcards_today"],
		queryFn: getFlashcardsForToday,
	});

	// Group flashcards by their set
	const groupFlashcardsBySet = () => {
		const grouped: Record<string, Flashcard[]> = {};
		if (flashcardsToday) {
			flashcardsToday.forEach((flashcard: Flashcard) => {
				const setId = flashcard.FlashcardSetID;
				if (!grouped[setId]) {
					grouped[setId] = [];
				}
				grouped[setId].push(flashcard);
			});
		}

		return grouped;
	};

	const flashcardsBySet = groupFlashcardsBySet();

	// const calculateReviewedProgress = (setId: string) => {
	// 	const flashcardsInSet = flashcardsBySet[setId] || [];
	// 	const totalFlashcards = flashcardsInSet.length;
	// 	const reviewedFlashcards = flashcardsInSet.filter(
	// 		(flashcard) =>
	// 			flashcard.Tracking &&
	// 			flashcard.Tracking.LastReviewed &&
	// 			new Date(flashcard.Tracking.LastReviewed).toDateString() ===
	// 				new Date().toDateString()
	// 	).length;

	// 	return (reviewedFlashcards / totalFlashcards) * 100;
	// };

	return (
		<div className="md:grid grid-cols-2 flex-col p-4 md:max-w-5xl md:w-5/6 mx-auto">
			<div className="border-[1px] rounded-lg py-4 m-2">
				<h1 className="text-3xl font-bold">
					Cards To{" "}
					<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
						Revise
					</span>
				</h1>

				{isFlashcardsLoading && <p>Loading flashcards...</p>}

				{isFlashcardsError && <p>Error fetching flashcards!</p>}

				{flashcardsToday && (
					<ul className="mt-4">
						{Object.keys(flashcardsBySet).map((setId) => {
							const flashcardsInSet = flashcardsBySet[setId];
							return (
								<ReviseInfo
									setId={setId}
									totalFlashcards={flashcardsInSet.length}
								/>
							);
						})}
					</ul>
				)}
			</div>

			<div className="border-[1px] rounded-lg py-4 space-y-2.5 m-2">
				<h1 className="text-3xl font-bold">Review progress</h1>
				<div
					className="radial-progress"
					style={{
						"--value": 70,
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
			</div>
		</div>
	);
};

export default Home;
