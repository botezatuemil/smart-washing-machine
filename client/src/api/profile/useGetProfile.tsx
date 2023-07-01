import { useQuery } from "react-query";
import { getProfile, UserProfile } from "./endpoints";

export const useGetProfile = (token: string) => {
  return useQuery<UserProfile>(
    "getProfile",
    async () => await getProfile(token),
    {
      refetchOnWindowFocus: true,
      onSuccess: () => {},
      onError: () => {},
    }
  );
};
