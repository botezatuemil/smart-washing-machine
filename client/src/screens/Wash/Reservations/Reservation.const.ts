export type FormReservation = ReservationResponseType & ReservationRequestType;

export type ReservationRequestType = {
  laundry: string;
  washingMachine: string;
  date: Date;
  timeSlot: string;
  time: Date
};

export type ReservationResponseType = {
  token: string;
};

export type SelectInputElements = {
  label: string;
  key: SelectType;
};

export type SelectType = "laundry" | "washingMachine" | "date" | "timeSlot" | "time";
