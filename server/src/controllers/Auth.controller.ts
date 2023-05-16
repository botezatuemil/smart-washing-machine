import { PrismaClient, student } from "@prisma/client";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface AuthResponse {
  email: string;
  password: string;
  expoToken: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, expoToken }: AuthResponse = req.body;
    const result: student[] =
      await prisma.$queryRaw`SELECT * FROM student WHERE email = ${email}`;

    await prisma.$queryRaw`UPDATE student set notification_token = ${expoToken} where email = ${email}`;
    if (result.length === 0) {
      res.status(401).json("Invalid credentials!");
      return;
    }
    if (await bcrypt.compare(password, result[0].password)) {
      const token = sign(
        {
          user_id: result[0].id,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          expo_token: result[0].notification_token,
        },
        process.env.TOKEN_KEY as string
      );
      res.send(JSON.stringify(token));
    } else {
      console.log("Password does not match");
      res.status(400).json("Invalid credentials!");
    }
  } catch (error) {
    console.log(error);
  }
};
