import { device, PrismaClient, washing_device } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeys, convertKeysArray } from "../utils/ConvertKeys";
import { convertTypes } from "../utils/ConvertTypes";
import {  connectToBroker, getPowerStatus, powerSmartPlug } from "../utils/mqttServer";
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
    const { option } = req.body;
    const convertedDeviceType = convertTypes(option);
    const washing_device = await prisma.$queryRaw<
      washing_device[]
    >`SELECT * from washing_device where washing_device.type = ${convertedDeviceType}::device`;
    res.send(convertKeysArray(washing_device));
  } catch (error) {
    console.log(error);
  }
};

export const startWashing = async (req: Request, res: Response) => {
  try {
    const { id, expoPushToken, user_id } = req.body;
    console.log(user_id);
    const wash = await prisma.$queryRaw<
      { washing_device_id: number }[]
    >`SELECT reservation.washing_device_id from reservation where reservation.id = ${id}`;
    const updated =
      await prisma.$queryRaw`UPDATE washing_device SET status = false where id = ${wash[0].washing_device_id}`;
    const client = connectToBroker();
    powerSmartPlug("cmnd/tasmota_1/POWER", "on", client);
    res.status(200).json("Washing machine unlocked successfully!");
    getPowerStatus(expoPushToken, client, "stat/+/STATUS8", user_id);
    // fs.readFile(
    //   "./src/files/inputTest.txt",
    //   "utf8",
    //   (err: NodeJS.ErrnoException | null, data: any) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     power = data.split(",");
    //   }
    // );

   
    // console.log(isFinished)

    // let isFinished = false;
    // const interval = setInterval(async () => {
    //   // const data = await getPowerStatus();

    //   if (!isFinished) {
    //     isFinished = (await getPowerStatus(
    //       parseInt(power[(i += 1)]),
    //       (counter += 1)
    //     )) as boolean;
    //     console.log("Finished");
    //   } else {
    //     // try counting again
    //     counter = 0;
    //   }
    //   console.log(isFinished);
    //   // io.emit("washing_machine", isFinished);
    // }, 3000);
    
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
