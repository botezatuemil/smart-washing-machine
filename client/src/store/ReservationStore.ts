import moment from "moment";
import React from "react";
import { create } from "zustand";
import { DeviceType } from "../interfaces";

export type ReservationStore = {
  id: React.Key;
  laundryId: React.Key;
  scheduledEarly: boolean;
  washingDeviceId: React.Key;
  laundryName: string;
  laundryFloor: number;
  deviceName: string;
  type: DeviceType;
  studentId: React.Key;
  startHour: moment.Moment;
  endHour: moment.Moment;
  date: moment.Moment;
};

type ReservationStoreType = {
  reservations: ReservationStore[];
  addReservationStore: (reservation: ReservationStore) => void;
  removeReservationStore: (id: React.Key) => void;
};

export const useReservationStore = create<ReservationStoreType>()(
  (set, get) => ({
    reservations: [],
    addReservationStore: (reservation: ReservationStore) => {
      set({ reservations: [...get().reservations, reservation] });
    },
    removeReservationStore: (id: React.Key) => {
      set({
        reservations: get().reservations.filter(
          (reservation) => reservation.id !== id
        ),
      });
    },
  })
);
