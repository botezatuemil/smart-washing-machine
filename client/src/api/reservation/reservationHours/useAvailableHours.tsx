import { useState } from "react";
import { useQuery } from "react-query";
import { AvailableHours } from "../../../interfaces";
import { Item } from "../../../screens/Wash/Reservations/Reservation.const";
import { getAvailableHours } from "./endpoints";
import moment from "moment";

export const useAvailableHours = (
  day: Date
): { items: Item | undefined; refetch: () => void } => {
  const [items, setItems] = useState<Item>();

  const { refetch } = useQuery<AvailableHours>(
    "getAvailableHours",
    async () => await getAvailableHours(day),
    {
      enabled: false,
      onSuccess: (data) => {
        const valuesIntervals = data?.reserve.map((interval) => ({
          id: moment(interval.startHour).utcOffset(0).format("HH:mm") +
          " - " +
          moment(interval.endHour).utcOffset(0).format("HH:mm"),
          name:
            moment(interval.startHour).utcOffset(0).format("HH:mm") +
            " - " +
            moment(interval.endHour).utcOffset(0).format("HH:mm"),
        }));
        setItems({
          title: "Available Hours",
          values: valuesIntervals,
        });
      },
      onError: () => console.log("Error getting hours"),
    }
  );

  return { items, refetch };
};
