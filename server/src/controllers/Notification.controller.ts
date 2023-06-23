import { notifications, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeys, convertKeysArray } from "../utils/ConvertKeys";
const prisma = new PrismaClient();

export const createNotification = async (
  notification: Omit<notifications, "id">
) => {
  try {
    await prisma.notifications.create({
      data: notification,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createNotifications = (
  notifications: Omit<notifications, "id">[]
) => {
  try {
    notifications.map(async (notification) => {
      await prisma.notifications.create({
        data: notification,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const user_id: number = res.locals.user_id;
  try {
    const notifications: unknown[] =
      await prisma.$queryRaw`select * from notifications where notifications.student_id = ${user_id}`;
    res.send(convertKeysArray(notifications));
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    console.log(id)
    await prisma.$queryRaw`delete from notifications where notifications.id = ${id}`;
    res.status(200).json("Notification deleted successfully!");
  } catch (error) {
    console.log(error);
  }
};
