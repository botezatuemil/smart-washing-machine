import { useQuery } from "react-query";
import { WashingOption } from "../../../interfaces";
import { getAllDevices } from "./endpoints";
import { Laundry } from "./types";

export const useDevices = (
  option: WashingOption,

) => {
  return useQuery<Laundry[]>(["devices", option], () => getAllDevices(option), {
    // enabled: true,
    onSuccess : () => console.log("success"),
    onError : () => console.log("error"),
  });
};
