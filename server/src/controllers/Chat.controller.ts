import { messages, PrismaClient, student } from "@prisma/client";
import { Request, Response } from "express";
import { convertKeys, convertKeysArray } from "../utils/ConvertKeys";

const prisma = new PrismaClient();

export const getConversations = async (req: Request, res: Response) => {
  const user_id: number = res.locals.user_id;

  try {
    let conversation: unknown[] = [];
    const foundUser1 = await prisma.$queryRaw<
      unknown[]
    >`select * from conversations where conversations.user1_id = ${user_id}`;
    if (foundUser1.length > 0) {
      conversation = await prisma.$queryRaw`
      select conversations.id, conversations.user1_id, 
      student.first_name, student.last_name, dorm.dorm_number, dorm.dorm_floor from conversations
      inner join student on student.id  = conversations.user2_id
      inner join dorm on dorm.id = student.dorm_id
      where conversations.user1_id = ${user_id};
      `;
    } else {
      const foundUser2 = await prisma.$queryRaw<
        unknown[]
      >`select * from conversations where conversations.user2_id = ${user_id}`;
      if (foundUser2.length > 0) {
        conversation = await prisma.$queryRaw`
        select conversations.id, conversations.user2_id, 
        student.first_name, student.last_name, dorm.dorm_number, dorm.dorm_floor from conversations
        inner join student on student.id  = conversations.user1_id
        inner join dorm on dorm.id = student.dorm_id
        where conversations.user2_id = ${user_id};
        `;
      }
    }
    res.send(convertKeysArray(conversation));
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.body;
  try {
    const messages: unknown[] = await prisma.$queryRaw`
          select messages.* from messages
          where messages.conversation_id = ${conversationId}
        `;
    res.send(convertKeysArray(messages));
  } catch (error) {
    console.log(error);
  }
};

export const getUpdatedMessage = async (data: Omit<messages, "id">) => {
  try {
    const message = await prisma.messages.create({
      data: {
        conversation_id: data.conversation_id,
        message: data.message,
        sender_id: data.sender_id,
        timestamp: data.timestamp,
      },
    });
    return message;
  } catch (error) {
    console.log(error);
  }
};

export const createChat = async (req: Request, res: Response) => {
  const user_id: number = res.locals.user_id;
  const { receiverId } = req.body;
  const existingConversation = await prisma.$queryRaw<unknown[]>`
  select * from conversations 
  where conversations.user1_id = ${user_id} 
  and conversations.user2_id = ${receiverId} 
  or conversations.user2_id = ${user_id}
  and conversations.user1_id = ${receiverId}`;

  try {
    if (existingConversation.length === 0) {
      const createdChat = await prisma.conversations.create({
        data: {
          user1_id: user_id,
          user2_id: receiverId,
        },
      });
      res.send(convertKeys(createdChat));
    }
  } catch (error) {
    console.log(error);
  }
};
