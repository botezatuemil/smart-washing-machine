import { useQuery } from "react-query";
import { WashingOption } from "../../../interfaces";
import { getAllDevices } from "./endpoints";

export const useDevices = (
  option: WashingOption,
  onSuccess?: (data: string) => void,
  onError?: (error: unknown) => void
) => {
  return useQuery("devices", () => getAllDevices(option), {
    onSuccess : () => console.log("success"),
    onError : () => console.log("error"),
  });
};
