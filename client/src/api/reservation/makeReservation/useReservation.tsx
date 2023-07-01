import { useMutation } from "react-query";
import { ReservationType } from "../../../interfaces";

import { ReservationStore } from "../../../store/ReservationStore";
import { addReservation } from "./endpoints";

export const useReservation = (
  onSuccess: (data: ReservationStore) => void,
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
