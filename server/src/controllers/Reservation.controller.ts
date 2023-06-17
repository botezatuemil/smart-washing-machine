import { device, PrismaClient, reservation } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment";
import { convertKeys, convertKeysArray, parseKeys } from "../utils/ConvertKeys";
import {
  ExpoTokenList,
  sendNotification,
  sendNotificationList,
} from "../utils/Notifications";

const prisma = new PrismaClient();

const MIN_HOUR = 12;
const MAX_HOUR = 24;

export const getAvailableHours = async (req: Request, res: Response) => {
  try {
    const option: { day: Date } = req.body;

    const sqlDate = moment(option.day)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // console.log(option.day);

    const reservations = await prisma.$queryRaw<
      reservation[]
    >`SELECT * from reservation where reservation.reservation_date::DATE = ${sqlDate}::DATE order by reservation.start_hour`;

    const availableHourRanges = [];
    let currentHour = moment(option.day)
      .set({ h: MIN_HOUR, m: 0, s: 0 })
      .utcOffset(0);
    let maxHour = moment(option.day)
      .set({ h: MAX_HOUR, m: 0, s: 0 })
      .utcOffset(0);

    reservations.forEach((interval) => {
      if (
        interval.start_hour.getTime() - currentHour.valueOf() >=
        20 * 60 * 1000
      ) {
        availableHourRanges.push({
          startHour: currentHour,
          endHour: moment(interval.start_hour).utcOffset(0),
        });
      }
      currentHour = moment(interval.end_hour).utcOffset(0);
    });

    // Check if there's an available range between the last interval's endHour and the maxHour
    if (maxHour.valueOf() - currentHour.valueOf() >= 20 * 60 * 1000) {
      availableHourRanges.push({ startHour: currentHour, endHour: maxHour });
    }

    res.send({ reserve: availableHourRanges });
  } catch (error) {
    console.log(error);
  }
};

export const addReservation = async (req: Request, res: Response) => {
  const { reservation } = req.body;

  // get the keys from camel case to snake case to keep consistency across frontend / backend
  console.log(reservation);
  const parsedReservation = parseKeys(reservation) as Omit<reservation, "id">;
  try {
    const addedReservation: reservation = await prisma.reservation.create({
      data: parsedReservation,
    });

    const reservationStore: unknown[] =
      await prisma.$queryRaw`SELECT laundry.laundry_name, laundry.laundry_floor, reservation.*,
    washing_device.device_name, washing_device.type FROM reservation 
    INNER JOIN laundry on  laundry.id = ${addedReservation.laundry_id}
    INNER JOIN washing_device on  washing_device.id = ${addedReservation.washing_device_id}
    WHERE reservation.id = ${addedReservation.id}`;

    const convertedReservation = convertKeys(reservationStore[0]);
    // console.log(convertedReservation);

    res.send(convertedReservation);
  } catch (error) {
    console.log(error);
  }
};

export const getHistory = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const reservationStore: unknown[] =
      await prisma.$queryRaw`SELECT laundry.laundry_name, laundry.laundry_floor, reservation.*,
    washing_device.device_name, washing_device.type FROM reservation
    INNER JOIN laundry on  laundry.id = reservation.laundry_id
    INNER JOIN washing_device on  washing_device.id = reservation.washing_device_id
    WHERE reservation.student_id = ${id}`;
    // console.log(convertKeysArray(reservationStore));
    res.send(convertKeysArray(reservationStore));
  } catch (error) {
    console.log(error);
  }
};

export const getIncomingReservation = async (req: Request, res: Response) => {
  const user_id: number = res.locals.user_id;
  
  try {
    const reservationStore: unknown[] =
      await prisma.$queryRaw`SELECT laundry.laundry_name, laundry.laundry_floor,reservation.*,
      washing_device.device_name, washing_device.type, washing_device.status, washing_device.student_id as washing_device_student_id,  washing_device.opened FROM reservation
      INNER JOIN laundry on  laundry.id = reservation.laundry_id
      INNER JOIN washing_device on  washing_device.id = reservation.washing_device_id
      WHERE reservation.student_id = ${user_id} 
      -- AND reservation.start_hour::timestamp >= (NOW() AT TIME ZONE 'Europe/Bucharest' - INTERVAL '10' MINUTE)
      ORDER BY reservation.reservation_date DESC, reservation.start_hour ASC  LIMIT 1`;
    console.log("recent", convertKeys(reservationStore[0]))

    res.send(convertKeys(reservationStore[0]));
  } catch (error) {
    console.log(error);
  }
};

export const endReservation = async (req: Request, res: Response) => {
  const { reservationId } = req.body;
  const user_id: number = res.locals.user_id;

  try {
    await prisma.$queryRaw`UPDATE washing_device set opened = true from reservation
    where reservation.washing_device_id = washing_device.id
    and reservation.id = ${reservationId}`;

    const tokens = await prisma.$queryRaw<
      ExpoTokenList[]
    >`SELECT student.notification_token, student.id from student where 
    student.id <> ${user_id}`;

    const newTokens = tokens.map((({id, notification_token}) => ({id: user_id, notification_token})));

    console.log(newTokens);
    const wash = await prisma.$queryRaw<
    { washing_device_id: number }[]
  >`SELECT reservation.washing_device_id from reservation where reservation.id = ${reservationId}`;
    const device = await prisma.$queryRaw<
      { type: device }[]
    >`SELECT washing_device.type from washing_device where washing_device.id = ${wash[0].washing_device_id}`;
    
    await prisma.$queryRaw`DELETE from reservation where reservation.id = ${reservationId}`;
    sendNotificationList(newTokens, device[0].type);
  } catch (error) {
    console.log(error);
  }
};
