export type WashingDevice = {
  id: number;
  deviceName: string;
  status: boolean;
  opened: boolean;
  laundryId: number;
  type: Device;
  student_id: number;
};

type Device = "WASHING_MACHINE" | "TUMBLE_DRYER";
