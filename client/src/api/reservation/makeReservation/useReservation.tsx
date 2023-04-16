import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { ReservationType } from "../../../interfaces";
import { ReservationRequestType } from "../../../screens/Wash/Reservations/Reservation.const";
import { addReservation } from "./endpoints";

export const useReservation = (
  onSuccess: (data: ReservationType) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation(
    "reservation",
    async (input: Omit<ReservationType, "id">) => await addReservation(input),
    {
      onSuccess,
      onError : () => console.log("Error on making a reservation"),
    }
  );
};
