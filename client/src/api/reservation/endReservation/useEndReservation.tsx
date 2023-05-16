import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { EndReservation, endReservation } from "./endpoints";

export const useEndReservation = (
  onSuccess?: (data: string) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation(
    "qr",
    async (input: EndReservation) => await endReservation(input),
    {
      onSuccess,
      onError: () => console.log("Failed authorizing"),
    }
  );
};
