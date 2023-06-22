import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { invalidateQuery } from "../../../utils/InvalidateCache";
import { EndReservation, endReservation } from "./endpoints";

export const useEndReservation = (
 
  onError?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation(
    "endReservation",
    async (input: EndReservation) => await endReservation(input),
    {
      onSuccess: async() => {
        console.log("sdf")
        await queryClient.invalidateQueries("incomingReservation")
        
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
