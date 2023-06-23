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
      -- AND reservation.start_hour::timestamp >= (NOW() AT TIME ZONE 'Europe/Bucharest')
      ORDER BY reservation.reservation_date::DATE, reservation.start_hour ASC  LIMIT 1`;
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

    const newTokens = tokens.map(({ id, notification_token }) => ({
      id: user_id,
      notification_token,
    }));

    const wash = await prisma.$queryRaw<
      { washing_device_id: number }[]
    >`SELECT reservation.washing_device_id from reservation where reservation.id = ${reservationId}`;
    const device = await prisma.$queryRaw<
      { type: device }[]
    >`SELECT washing_device.type from washing_device where washing_device.id = ${wash[0].washing_device_id}`;
    const deletedReservation: reservation[] =
      await prisma.$queryRaw`select * from reservation where reservation.id = ${reservationId}`;
    await prisma.$queryRaw`DELETE from reservation where reservation.id = ${reservationId}`;
    const message =
      device[0].type === "WASHING_MACHINE"
        ? "A new washing machine is available!"
        : "A new dryer is available";
    sendNotificationList(newTokens, message, "AVAILABLE");
    scheduleEarly(moment(), moment.utc(deletedReservation[0].end_hour));
    // res.status(200).json("Success")
    res.send({id: deletedReservation[0].id})
  } catch (error) {
    console.log(error);
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  const { reservationId } = req.body;
  try {
    const deletedReservation: reservation[] =
      await prisma.$queryRaw`select * from reservation where reservation.id = ${reservationId}`;
    await prisma.$queryRaw`delete from reservation where reservation.id = ${reservationId}`;
    scheduleEarly(
      moment.utc(deletedReservation[0].start_hour),
      moment.utc(deletedReservation[0].end_hour)
    );
    res.status(200).json("Reservation deleted successfully");
   
  } catch (error) {
    console.log(error);
  }
};

const getValue = (interval: reservation) => {
  let startHour = interval.start_hour.getTime();
  let endHour = interval.end_hour.getTime();
  return Math.floor((endHour - startHour) / (1000 * 60));
};

export const updateReservationTime = async (
  reservationId: number,
  startDate: moment.Moment,
  endDate: moment.Moment
) => {
  try {
    const sqlStartDate = startDate.format("YYYY-MM-DD HH:mm:ss");
    const sqlEndDate = endDate.format("YYYY-MM-DD HH:mm:ss");

    await prisma.$queryRaw`update reservation set start_hour = ${sqlStartDate}::timestamp, end_hour = ${sqlEndDate}::timestamp where reservation.id = ${reservationId}`;
  } catch (error) {
    console.log(error);
  }
};

const getTokenById = async (studentId: number) => {
  try {
    const result = await prisma.$queryRaw<
      { notification_token: string }[]
    >`select student.notification_token from student where student.id = ${studentId}`;
    return result[0].notification_token;
  } catch (error) {
    console.log(error);
  }
};

export const scheduleEarly = async (
  startTime: moment.Moment,
  endTime: moment.Moment
) => {
  try {
    const intervals: reservation[] =
      await prisma.$queryRaw`SELECT * from reservation where reservation.scheduled_early = true and reservation.start_hour > ${startTime}::timestamp`;

    if (intervals.length === 0) {
      return;
    }
    const sortedIntervals = intervals.sort((r1, r2) =>
      r1.end_hour.getTime() - r1.start_hour.getTime() <
      r2.end_hour.getTime() - r2.start_hour.getTime()
        ? -1
        : 1
    );
    let n = sortedIntervals.length;

    let intervalLength = Math.floor(endTime.diff(startTime, "minutes"));
    console.log(intervalLength);
    let dp = Array.from({ length: n + 1 }, () =>
      new Array(intervalLength + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= intervalLength; j++) {
        if (getValue(sortedIntervals[i - 1]) <= j) {
          dp[i][j] = Math.max(
            dp[i - 1][j],
            dp[i - 1][j - getValue(sortedIntervals[i - 1])] +
              getValue(sortedIntervals[i - 1])
          );
        } else {
          dp[i][j] = dp[i - 1][j];
        }
      }
    }

    // Determine the scheduled reservations by looking if it was inclued or not in the current optimal, and if it is go to the remaining interval and repeat
    let scheduledReservations: reservation[] = [];
    let i = n,
      j = intervalLength;
    while (i > 0 && j > 0) {
      if (dp[i][j] != dp[i - 1][j]) {
        scheduledReservations.push(sortedIntervals[i - 1]);
        j -= getValue(sortedIntervals[i - 1]);
      }
      i--;
    }

    let start = startTime;
    for (let reservation of scheduledReservations.reverse()) {
      let end = start.clone().add(getValue(reservation), "minutes");
      // Update the time of the reservation
      updateReservationTime(reservation.id, start, end);
      const message =
        "Your reservation has been scheduled early from: " +
        moment(start).format("YYYY-MM-DD hh:mm") +
        " to " +
        moment(end).format("YYYY-MM-DD hh:mm");
      sendNotification(await getTokenById(reservation.student_id), message, "SCHEDULE_EARLY");
      // The start time for the next reservation is the end time of the current one
      start = end;
    }
  } catch (error) {
    console.log(error);
  }
};
