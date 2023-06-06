import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { deleteNotification, RequestNotificationDelete } from "./endpoints";

export const useDeleteNotification = (
  onSuccess?: (data: string) => void,
  onError?: (error: unknown) => void
) => {
    const queryClient = useQueryClient();
  return useMutation(
    "deleteNotification",
    async (input: RequestNotificationDelete) => await deleteNotification(input),
    {
      onSuccess : async() => {
        await queryClient.invalidateQueries("getNotifications");
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
