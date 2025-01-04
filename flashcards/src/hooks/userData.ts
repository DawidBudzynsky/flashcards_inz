import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../requests/user';

export const useUserData = () => {
    const queryClient = useQueryClient();

    // Try to retrieve cached data
    const cachedUser = queryClient.getQueryData(['user']);

    const { data, status, error } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        initialData: cachedUser, // Use cache if available
        staleTime: 5 * 60 * 1000, // 5 minutes stale time
    });

    return {
        user: data,
        flashcardSets: data?.FlashcardsSets || [],
        folders: data?.Folders || [],
        status,
        error,
    };
};
