import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { getNotifications, Notification } from "./endpoints";

export const useGetNotifications = (token: string) => {
  return useQuery<Notification[]>("getNotifications", async () => await getNotifications(token), {
    onSuccess: () => {},
    onError: () => {},
  });
};