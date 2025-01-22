import { useQuery } from "@tanstack/react-query";
import { FlashcardSet } from "../types/interfaces";
import { getUserFlashcardsSets } from "../requests/flashcardset";

const useFlashcardSets = () => {
	const { data, error, isLoading } = useQuery<FlashcardSet[]>({
		queryKey: ["sets"],
		queryFn: getUserFlashcardsSets,
	});

	return {
		sets: data,
		isLoading,
		error,
	};
};

export default useFlashcardSets;
