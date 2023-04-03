import {  useQuery } from "react-query";
import { LaundryType } from "../../screens/Wash/Reservations/Reservation.const";
import { getLaundries } from "./endpoints";

export const useLaundries = (
) => {
  return useQuery<LaundryType[]>(
    "getLaundries",
    async () => await getLaundries(),
    {
      // enabled: false,
      onSuccess : () => console.log("Success fetching laundries"),
      onError : () => console.log("Error getting laundries"),
    }
  );
};
