import cron from "node-cron";
import { PrismaClient, reservation } from "@prisma/client";

const prisma = new PrismaClient();

// delete if the reservation has not been scanned
// delete if the end hour is lower than the now, but only if the user has taken his clothes (opened = true)

cron.schedule("* * * * *", async () => {   
  try {
    const reservations = await prisma.$queryRaw<
      reservation[]
    >`select reservation.* from reservation
    inner join washing_device on  washing_device.id = reservation.washing_device_id
    and reservation.start_hour::timestamp < (NOW() AT TIME ZONE 'Europe/Bucharest' - INTERVAL '2' MINUTE) 
    and reservation.end_hour > NOW() AT TIME ZONE 'Europe/Bucharest' 
    and washing_device.status = true 
    and washing_device.opened = true
    or reservation.end_hour::timestamp < (NOW() AT TIME ZONE 'Europe/Bucharest' - INTERVAL '2' MINUTE)
    `;
    if (reservations.length !== 0) {
      reservations.map(async (reservation) => {
        await prisma.$queryRaw`delete from reservation where reservation.id = ${reservation.id}`;
        await prisma.$queryRaw`UPDATE washing_device SET status = true, opened = true where id = ${reservation.washing_device_id}`
      });
    } else {
      console.log("Every thing up to date!")
    }
  } catch (error) {
    console.log(error);
  }
});
