import { useState } from "react";
import { useQuery } from "react-query";
import {
  ReservationStore,
  useReservationStore,
} from "../../../store/ReservationStore";
import { getHistory } from "./endpoints";

export const useHistory = (id: React.Key) => {
  const { setReservations } = useReservationStore();
  return useQuery<ReservationStore[]>(
    "history",
    async () => await getHistory(id),
    {
      onSuccess: (data) => {
        console.log("data","a intrat");
        setReservations(data);
      },
      onError: () => console.log("Error getting history"),
    }
  );
};
