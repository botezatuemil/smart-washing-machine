import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { RequestReservationDelete, deleteReservation } from "./endpoints";

export const useDeleteReservation = (
) => {
    const queryClient = useQueryClient();
  return useMutation(
    "deleteReservation",
    async (input: RequestReservationDelete) => await deleteReservation(input),
    {
      onSuccess : async() => {
       await queryClient.invalidateQueries("history")
       await queryClient.invalidateQueries("incomingReservation")
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
