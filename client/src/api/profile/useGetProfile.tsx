import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { getProfile, UserProfile } from "./endpoints";

export const useGetProfile = (token: string) => {
  return useQuery<UserProfile>("getProfile", async () => await getProfile(token), {
    onSuccess: () => {},
    onError: () => {},
  });
};