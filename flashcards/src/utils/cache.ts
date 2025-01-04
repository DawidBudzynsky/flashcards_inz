import { useQueryClient } from "@tanstack/react-query";

export const getCachedValue = (key: string) => {
    // Retrieve data for a specific query key
    const queryClient = useQueryClient();
    const cachedValue = queryClient.getQueryData([key]);
    console.log('Cached user:', cachedValue);
    return cachedValue;
};

