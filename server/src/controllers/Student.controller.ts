import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface Student {
  id: number;
  name: string;
}

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students: Student[] = await prisma.$queryRaw<
      Student[]
    >`SELECT * FROM student`;
    res.send(JSON.stringify(students));
  } catch (error) {
    console.log(error);
  }
};

export const addExpoToken = async(req: Request, res: Response) => {
    const { expoToken} = req.body;
    const user_id: number = res.locals.user_id;
    console.log("token", expoToken);
    console.log("user", user_id);
    try {
      
    } catch (error) {
      
    }

}
