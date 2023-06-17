import { useQueryClient } from "react-query"

export const invalidateQuery = async(cacheType: string) => {
    const queryClient = useQueryClient();
    await queryClient.invalidateQueries(cacheType);
}