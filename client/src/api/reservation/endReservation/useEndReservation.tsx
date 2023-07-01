import { useMutation, useQueryClient } from "react-query";
import { EndReservation, endReservation } from "./endpoints";
import {
  useReservationStore,
} from "../../../store/ReservationStore";
import { WashingOption } from "../../../interfaces";

export const useEndReservation = (
) => {
  const queryClient = useQueryClient();
  const {removeReservationStore}  = useReservationStore();
  return useMutation(
    "endReservation",
    async (input: EndReservation) => await endReservation(input),
    {
      onSuccess: async(data : {id: number}) => {
        await queryClient.invalidateQueries("incomingReservation");
        await queryClient.refetchQueries(["allDevices", "washing machine" as WashingOption]);
        await queryClient.refetchQueries(["allDevices", "tumble dryer" as WashingOption]);
        removeReservationStore(data.id);
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
