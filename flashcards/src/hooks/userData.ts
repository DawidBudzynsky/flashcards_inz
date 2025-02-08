import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../requests/user";
import { User } from "../types/interfaces";

export const useUserData = () => {
  const queryClient = useQueryClient();

  const cachedUser = queryClient.getQueryData<User>(["user"]);

  const { data, status, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    initialData: cachedUser,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: data,
    flashcardSets: data?.FlashcardsSets || [],
    folders: data?.Folders || [],
    status,
    error,
  };
};
