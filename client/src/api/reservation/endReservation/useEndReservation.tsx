import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { invalidateQuery } from "../../../utils/InvalidateCache";
import { EndReservation, endReservation } from "./endpoints";
import {
  ReservationStore,
  useReservationStore,
} from "../../../store/ReservationStore";

export const useEndReservation = (
) => {
  const queryClient = useQueryClient();
  const {removeReservationStore}  = useReservationStore();
  return useMutation(
    "endReservation",
    async (input: EndReservation) => await endReservation(input),
    {
      onSuccess: async(data : {id: number}) => {
        console.log("intri?")
        await queryClient.invalidateQueries("incomingReservation");
        removeReservationStore(data.id);
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
