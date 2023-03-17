import { PrismaClient, washing_device } from "@prisma/client";
import { Request, Response } from "express";

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
};

export const getLaundryDevices = async(req: Request, res: Response) => {
    const {deviceType} = req.body;

    const laundryData : Laundry[] = await prisma.$queryRaw<Laundry[]>`
        SELECT  from washing_device, 
    `
};

export const updateWashingMachineStatus = () => {};
