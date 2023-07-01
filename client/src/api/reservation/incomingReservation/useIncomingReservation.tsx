import { useQuery } from "react-query";
import {
    ReservationStore,
  } from "../../../store/ReservationStore";
import {getIncomingReservation} from "./endpoints"

export const useIncomingReservation = (token: string) => {
  return useQuery<ReservationStore>("incomingReservation", async () => await getIncomingReservation(token), {
    onSuccess : (data) => {},
    onError : () => {}, 
  });
};