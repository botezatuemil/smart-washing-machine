export interface IStudent {
  id: number;
  name: string;
}

export type WashingOption = "washing machine" | "tumble dryer"

export type WashingDevice = {
  id: number
  name: string
  status: boolean
  opened: boolean
  laundry_id: number
  type: DeviceType
  student_id: number
}

export type DeviceType = "WASHING_MACHINE" | "TUMBLE_DRYER"