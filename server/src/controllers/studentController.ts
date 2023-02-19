import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface Student {
    id : number;
    name: string;
}

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students : Student[] = await prisma.$queryRaw<Student[]>`SELECT * FROM student`;
    console.log(students);
    res.send(JSON.stringify(students));
  } catch (error) {
    console.log(error);
  }
};
