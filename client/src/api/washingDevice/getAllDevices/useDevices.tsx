import { useQuery } from "react-query";
import { WashingOption } from "../../../interfaces";
import { getAllDevices } from "./endpoints";
import { Laundry } from "./types";

export const useDevices = (
  option: WashingOption,
  onSuccess?: (data: string) => void,
  onError?: (error: unknown) => void
) => {
  return useQuery<Laundry[]>(["devices", option], () => getAllDevices(option), {
    onSuccess : () => console.log("success"),
    onError : () => console.log("error"),
  });
};
