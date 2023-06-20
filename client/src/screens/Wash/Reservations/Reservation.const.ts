import React from "react";
import { WashingOption } from "../../../interfaces";

export type FormReservation = ReservationResponseType & ReservationRequestType;

export type ReservationRequestType = {
  laundry: string;
  washingMachine: string;
  date: Date;
  time: string;
  timeSlot: string;
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
  values: { name: string; id: number | string }[];
  title: string;
  washingOption? : WashingOption
};

export type LaundryType = {
  id: number;
  laundryName: string;
  laundryFloor: number;
  buildingId: number;
};
