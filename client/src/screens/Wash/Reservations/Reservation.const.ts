import React from "react";

export type FormReservation = ReservationResponseType & ReservationRequestType;

export type ReservationRequestType = {
  laundry: string;
  washingMachine: string;
  date: Date;
  timeSlot: string;
  time: Date;
};

export type ReservationResponseType = {
  token: string;
};

export type SelectInputElements = {
  label: string;
  key: SelectType;
};

export type SelectType =
  | "laundry"
  | "washingMachine"
  | "date"
  | "timeSlot"
  | "time";

export type Item = {
  values: { name: string; obj: any }[] | undefined;
  title: string;
};

export type LaundryType = {
  id: React.Key;
  laundryName: string;
  laundryFloor: number;
  buildingId: number;
};
