import { device, PrismaClient, washing_device } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeys, convertKeysArray } from "../utils/ConvertKeys";
import { convertTypes } from "../utils/ConvertTypes";
import {
  connectToBroker,
  getPowerStatus,
  powerSmartPlug,
} from "../utils/mqttServer";
import { sendNotification } from "../utils/Notifications";
const fs = require("fs");

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
  washingDeviceName: string;
  washingDeviceId: number;
  opened: boolean;
  status: boolean;
  laundryName: string;
};

export const getLaundryDevices = async (req: Request, res: Response) => {
  const { option } = req.body;
  const convertedDeviceType = convertTypes(option);
  const laundryData: Laundry[] = await prisma.$queryRaw<Laundry[]>`
        SELECT washing_device.id as washing_device_id, device_name as washing_device_name, status, opened, laundry_id, type, student_id, first_name, last_name, dorm_id, dorm_number,
        dorm_floor, laundry_floor, laundry_name, dorm.id FROM washing_device
        INNER JOIN laundry on laundry.id = washing_device.laundry_id
        INNER JOIN student on student.id =  washing_device.student_id
        INNER JOIN dorm on dorm.id = student.dorm_id
        WHERE ${convertedDeviceType}::device = type
        GROUP BY washing_device.id, student.first_name, student.last_name, student.dorm_id, dorm.dorm_number, dorm.dorm_floor, laundry.laundry_floor, laundry_name, dorm.id
    `;

  res.send(convertKeysArray(laundryData));
};

export const getDevicesSelect = async (req: Request, res: Response) => {
  try {
    const { option, laundry_id } = req.body;
    console.log(laundry_id)
    const convertedDeviceType = convertTypes(option);
    const washing_device = await prisma.$queryRaw<
      washing_device[]
    >`SELECT * from washing_device where washing_device.type = ${convertedDeviceType}::device and laundry_id = ${laundry_id}`;
    res.send(convertKeysArray(washing_device));
  } catch (error) {
    console.log(error);
  }
};

export const startWashing = async (req: Request, res: Response) => {
  try {
    const { id, expoPushToken, user_id } = req.body;
    const wash = await prisma.$queryRaw<
      { washing_device_id: number }[]
    >`SELECT reservation.washing_device_id from reservation where reservation.id = ${id}`;

    const device = await prisma.$queryRaw<
      { type: device }[]
    >`SELECT washing_device.type from washing_device where washing_device.id = ${wash[0].washing_device_id}`;
    const updated =
      await prisma.$queryRaw`UPDATE washing_device SET status = false, opened = false, student_id = ${user_id} where id = ${wash[0].washing_device_id}`;
    const client = connectToBroker();
    powerSmartPlug("cmnd/tasmota_1/POWER", "on", client);
    res.status(200).json("Washing machine unlocked successfully!")
    getPowerStatus(
      expoPushToken,
      client,
      "stat/+/STATUS8",
      user_id,
      device[0].type
    );
   
  } catch (error) {
    console.log(error);
  }
};

export const updateWashingMachineStatus = async (smart_plug_id: number) => {
  try {
    const wash = await prisma.$queryRaw<
      { washing_device_id: number }[]
    >`SELECT smart_plug.washing_device_id from smart_plug where smart_plug.id = ${smart_plug_id}`;
    const updated =
      await prisma.$queryRaw`UPDATE washing_device SET status = true where id = ${wash[0].washing_device_id}`;
  } catch (error) {
    console.log(error);
  }
};
