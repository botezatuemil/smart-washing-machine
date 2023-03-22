export type FormReservation = ReservationResponseType & ReservationRequestType;

export type ReservationRequestType = {
  laundry: string;
  washingMachine: string;
  startHour: string;
  endHour: string;
};

export type ReservationResponseType = {
  token: string;
};

export type SelectInputElements = {
  label: string;
  key: SelectType;
};

export type SelectType = "laundry" | "washingMachine" | "startHour" | "endHour";
