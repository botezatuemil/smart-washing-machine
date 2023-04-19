import { useQuery } from "react-query";
import { ReservationType, WashingOption } from "../../../interfaces";
import {
    ReservationStore,
    useReservationStore,
  } from "../../../store/ReservationStore";
import {getIncomingReservation} from "./endpoints"

export const useIncomingReservation = (token: string) => {
  return useQuery<ReservationStore>("incomingReservation", async () => await getIncomingReservation(token), {
    onSuccess : (data) => console.log(data),
    onError : () => console.log("error incoming"), 
  });
};