import { useQuery } from "@tanstack/react-query";
import { getUserFlashcardsSets } from "../../requests/flashcardset";
import { FlashcardSet } from "../../types/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ListItem from "../ListItem";
import useFuzzySearch from "../../hooks/useFuzzySearch";

const SetsPresentation: React.FC = () => {
	const navigate = useNavigate();

	const { data: sets } = useQuery<FlashcardSet[]>({
		queryKey: ["sets"],
		queryFn: getUserFlashcardsSets,
	});

	const {
		query,
		setQuery,
		filteredData: filteredSets,
	} = useFuzzySearch(sets || [], "", "Title");

	const handleNavigate = () => {
		navigate("/create");
	};

	return (
		<div className="p-4 max-w-5xl w-full mx-auto">
			<div className="flex justify-between w-5/6 mx-auto py-3">
				<h2 className="text-3xl mb-4">Your Flashcard Sets</h2>

				<input
					type="text"
					placeholder="Search for set"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="input input-bordered w-full max-w-xs"
				/>

				<button
					onClick={handleNavigate}
					className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 hover:scale-105 duration-150"
				>
					Create new Set
				</button>
			</div>

			<div className="max-w-5xl w-full space-y-3">
				<AnimatePresence>
					{filteredSets && filteredSets.length > 0 ? (
						filteredSets.map((set: FlashcardSet) => (
							<motion.div
								key={set.ID}
								initial={{
									opacity: 0,
									y: -10,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								exit={{
									opacity: 0,
									y: 10,
								}}
								transition={{
									duration: 0.3,
								}}
							>
								<ListItem set={set} />
							</motion.div>
						))
					) : (
						<motion.div
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}
							transition={{
								duration: 0.3,
							}}
							className="text-center text-gray-500 mt-4"
						>
							No searches found ☹️
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default SetsPresentation;
