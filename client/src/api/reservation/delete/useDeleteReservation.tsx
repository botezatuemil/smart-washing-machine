import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { RequestReservationDelete, deleteReservation } from "./endpoints";

export const useDeleteReservation = (
  onSuccess?: (data: string) => void,
) => {
    const queryClient = useQueryClient();
  return useMutation(
    "deleteReservation",
    async (input: RequestReservationDelete) => await deleteReservation(input),
    {
      onSuccess : () => {
       queryClient.invalidateQueries("history")
       queryClient.invalidateQueries("incomingReservation")
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
