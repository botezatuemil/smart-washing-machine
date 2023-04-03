import { useQuery } from "react-query";
import { WashingOption } from "../../../interfaces";
import { getDevicesSelect } from "./endpoints";
import { WashingDevice } from "./types";

export const useDevicesSelect = (
  option: WashingOption,
) => {
  return useQuery<WashingDevice[]>(["devices", option], () => getDevicesSelect(option), {
    // enabled: false,
    onSuccess : () => console.log("success"),
    onError : () => console.log("error"),
  });
};
