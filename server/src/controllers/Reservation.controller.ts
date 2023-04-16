import { PrismaClient, reservation } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment";
import { parseKeys } from "../utils/ConvertKeys";

const prisma = new PrismaClient();

const MIN_HOUR = 12;
const MAX_HOUR = 25;

export const getAvailableHours = async (req: Request, res: Response) => {
  try {
    const option: { day: Date } = req.body;

    const sqlDate =  moment(option.day)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")

      console.log(option.day);

    const reservations = await prisma.$queryRaw<
      reservation[]
    >`SELECT * from reservation where reservation.reservation_date::DATE = ${sqlDate}::DATE order by reservation.start_hour`;

    
    const availableHourRanges = []
    let currentHour = moment(option.day).set({h: MIN_HOUR, m: 0, s: 0}).utcOffset(0)
    let maxHour = moment(option.day).set({h: MAX_HOUR, m: 0, s: 0}).utcOffset(0);
    
    reservations.forEach((interval) => {
      if (interval.start_hour.getTime() - currentHour.valueOf() >= 20 * 60 * 1000) {
        availableHourRanges.push({ startHour: currentHour, endHour: moment(interval.start_hour).utcOffset(0)});
      }
      currentHour = moment(interval.end_hour).utcOffset(0);
    });
   
     // Check if there's an available range between the last interval's endHour and the maxHour
    if (maxHour.valueOf() - currentHour.valueOf() >= 20 * 60 * 1000) {
      availableHourRanges.push({ startHour: currentHour, endHour: maxHour })
    }

    res.send({ reserve: availableHourRanges})
  } catch (error) {
    console.log(error);
  }
};

export const addReservation = async(req: Request, res: Response) => {
  const {reservation} = req.body

  // get the keys from camel case to snake case to keep consistency across frontend / backend
  const parsedReservation = parseKeys(reservation) as Omit<reservation, "id">;
  try {
    const data = await prisma.reservation.create({data: parsedReservation})
    res.send({data})
  } catch (error) {
    console.log(error)
  }
}
