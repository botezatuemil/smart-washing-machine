import cron from "node-cron";
import { PrismaClient, reservation } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

cron.schedule("* * * * *", async () => {
  const currentHour = moment().utc().subtract(10, "minutes").toISOString();
  console.log(currentHour);

  try {
    const reservations = await prisma.$queryRaw<
      reservation[]
    >`select * from reservation where reservation.start_hour::timestamp < (NOW() AT TIME ZONE 'Europe/Bucharest' - INTERVAL '10' MINUTE)`;
    if (reservations.length !== 0) {
      reservations.map(async (reservation) => {
        await prisma.$queryRaw`delete from reservation where reservation.id = ${reservation.id}`;
        console.log("delete", reservation.id);
      });
    }
  } catch (error) {
    console.log(error);
  }
});
