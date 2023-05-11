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
  washingDeviceStudentId: React.Key;
  startHour: moment.Moment;
  endHour: moment.Moment;
  reservationDate: moment.Moment;
  status: boolean;
  opened: boolean;
};

type ReservationStoreType = {
  reservations: ReservationStore[];
  addReservationStore: (reservation: ReservationStore) => void;
  removeReservationStore: (id: React.Key) => void;
  setReservations: (reservations: ReservationStore[]) => void;
  sortedReservations: () => Map<string, ReservationStore[]>;
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
    setReservations: (reservations: ReservationStore[]) => {
      set({
        reservations: reservations,
      });
    },
    sortedReservations: () => {
      const reservations = get().reservations;
      let hashmap = new Map<string, ReservationStore[]>();

      reservations.map((reservation) => {
        const date = moment(reservation.reservationDate).utc().format("L");
        const prev = hashmap.get(date);

        if (prev) {
          hashmap.set(date, [...prev, reservation]);
        } else {
          hashmap.set(date, [reservation]);
        }
      });

      return hashmap;
    },
  })
);
