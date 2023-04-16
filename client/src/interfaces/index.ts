import moment from "moment";

export interface IStudent {
  id: number;
  name: string;
}

export type WashingOption = "washing machine" | "tumble dryer";

export type WashingDevice = {
  id: number;
  name: string;
  status: boolean;
  opened: boolean;
  laundry_id: number;
  type: DeviceType;
  student_id: number;
};

export type DeviceType = "WASHING_MACHINE" | "TUMBLE_DRYER";

export type AvailableHours = {
  reserve: HourInterval[]
}

export type HourInterval = {
  startHour: moment.Moment
  endHour: moment.Moment;
};

export type ReservationType = {
  id : React.Key;
  laundryId : React.Key;
  washingDeviceId:  React.Key;
  reservationDate : moment.Moment;
  startHour : moment.Moment;
  endHour : moment.Moment;
  scheduledEarly: boolean;
  studentId : React.Key;
}