import { PrismaClient, laundry } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeysArray } from "../utils/ConvertKeys";

const prisma = new PrismaClient();

export const getLaundries = async (req: Request, res: Response) => {
  try {
    const laundries = await prisma.$queryRaw<laundry[]>`SELECT * from laundry`;
    res.send(convertKeysArray(laundries));
  } catch (error) {
    console.log(error);
  }
};
