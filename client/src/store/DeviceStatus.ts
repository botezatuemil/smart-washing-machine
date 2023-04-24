import { create } from "zustand";

type DeviceStatusType = {
  status: boolean;
  setStatus: (newState: boolean) => void;
};
export const useDeviceStatusStore = create<DeviceStatusType>()((set) => ({
  status: false,
  setStatus: (newState: boolean) => set((state) => ({ status: newState })),
}));
