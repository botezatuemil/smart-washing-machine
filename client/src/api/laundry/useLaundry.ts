import { useState } from "react";
import {  useQuery } from "react-query";
import { Item, LaundryType } from "../../screens/Wash/Reservations/Reservation.const";
import { getLaundries } from "./endpoints";

export const useLaundries = () : { items: Item | undefined, refetch : () => void}  => {
  const [items, setItems] = useState<Item>();
  
  const {refetch} = useQuery<LaundryType[]>(
    "getLaundries",
    async () => await getLaundries(),
    {
      enabled: false,
      onSuccess : (data) => {
        const valuesLaundry = data?.map((laundry) => ({
          obj: { ...laundry },
          name: laundry.laundryName + " / floor " + laundry.laundryFloor,
        }));
    
        setItems({
          title: "Available Laundries",
          values: valuesLaundry,
        });
      },
      onError : () => console.log("Error getting laundries"),
    }
  );

  return {items, refetch}
};
