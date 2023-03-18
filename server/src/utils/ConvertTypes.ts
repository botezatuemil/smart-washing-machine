import { device } from "@prisma/client";
import { DeviceType } from "../interfaces/index.interface";

export const convertTypes = (deviceType: DeviceType) => {
  if (deviceType === "washing machine") {
    return device.WASHING_MACHINE;
  }
  return device.TUMBLE_DRYER;
};
