import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeys } from "../utils/ConvertKeys";

const prisma = new PrismaClient();

export const getProfile = async(req: Request, res: Response) => {
  const user_id: number = res.locals.user_id;
  try {
    const profile : unknown[] = await prisma.$queryRaw`
    select student.first_name, student.last_name, student.email ,
     dorm.dorm_number as dorm_number, dorm.dorm_floor , building.number as building, campus.name as campus from student
    inner join dorm on dorm.id = student.dorm_id
    inner join building on building.id = dorm.building_id
    inner join campus on campus.id = building.campus_id
    where student.id = ${user_id}`
    res.send(convertKeys(profile[0]))
  } catch (error) {
    console.log(error)
  }
}
