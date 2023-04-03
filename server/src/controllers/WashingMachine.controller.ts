import { device, PrismaClient, washing_device } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeys, convertKeysArray } from "../utils/ConvertKeys";
import { convertTypes } from "../utils/ConvertTypes";
const prisma = new PrismaClient();

type Laundry = {
  studentId: number;
  firstName: string;
  lastName: string;
  dormId: number;
  dormNumber: string;
  dormFloor: number;
  laundryId: number;
  laundryFloor: number;
  washingDeviceName: number;
  washingDeviceId: number;
  opened: boolean;
  status: boolean;
};

export const getLaundryDevices = async (req: Request, res: Response) => {
  const { option } = req.body;
  const convertedDeviceType = convertTypes(option);
  const laundryData: Laundry[] = await prisma.$queryRaw<Laundry[]>`
        SELECT washing_device.id, device_name as washing_device_name, status, opened, laundry_id, type, student_id, first_name, last_name, dorm_id, dorm_number,
        dorm_floor, laundry_floor, dorm.id FROM washing_device
        INNER JOIN laundry on laundry.id = washing_device.laundry_id
        INNER JOIN student on student.id =  washing_device.student_id
        INNER JOIN dorm on dorm.id = student.dorm_id
        WHERE ${convertedDeviceType}::device = type
        GROUP BY washing_device.id, student.first_name, student.last_name, student.dorm_id, dorm.dorm_number, dorm.dorm_floor, laundry.laundry_floor, dorm.id
    `;

  res.send(convertKeysArray(laundryData));
};

export const getDevicesSelect = async (req: Request, res: Response) => {
  try {
    const {option} = req.body;
    const convertedDeviceType = convertTypes(option);
    const washing_device = await prisma.$queryRaw<washing_device[]>`SELECT * from washing_device where washing_device.type = ${convertedDeviceType}::device`;
    console.log('====================================');
    console.log(washing_device);
    console.log('====================================');
    res.send(convertKeysArray(washing_device));
  } catch (error) {
    console.log(error);
  }
};

export const updateWashingMachineStatus = () => {};
