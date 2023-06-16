import { useState } from "react";
import { useQuery } from "react-query";
import { WashingOption } from "../../../interfaces";
import { Item } from "../../../screens/Wash/Reservations/Reservation.const";
import { getDevicesSelect } from "./endpoints";
import { WashingDevice } from "./types";

export const useDevicesSelect = (option: WashingOption) : { items: Item | undefined, refetch : () => void} => {
  const [items, setItems] = useState<Item>();
  const { refetch } = useQuery<WashingDevice[]>(
    "devices",
    async () => await getDevicesSelect(option),
    {
      enabled: false,
      onSuccess: (data) => {
        const valuesDevice = data?.map((washingMachine) => ({
          id: washingMachine.id,
          name: washingMachine.deviceName,
        }));
        setItems({
          title: "Available Devices",
          values: valuesDevice,
        });
      },
      onError: () => console.log("error"),
    }
  );
  return { items, refetch };
};
