import { Expo } from "expo-server-sdk";
import { notifications, PrismaClient } from "@prisma/client";
import { createNotification } from "../controllers/Notification.controller";

export type Notification = {
  body: string;
  data?: { id: string; };
};

export type ExpoTokenList = {
  id: number;
  notification_token: string;
};

export const sendNotification = (
  expoPushToken: string | undefined,
  message: string,
  type: string
) => {
  const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });

  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(
      `Push token ${expoPushToken} is not a valid Expo push token`
    );
    return;
  }

  const messageSend = {
    to: expoPushToken,
    body: message,
    data: {type}
  }

  let chunks = expo.chunkPushNotifications([messageSend]);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

export const sendNotificationList = (
  tokens: ExpoTokenList[],
  message: string,
  type: string
) => {
  const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });
  let messages = [];
  for (let { notification_token, id } of tokens) {
    if (!Expo.isExpoPushToken(notification_token)) {
      console.error(
        `Push token ${notification_token} is not a valid Expo push token`
      );
      continue;
    }
    messages.push({
      to: notification_token,
      body: message,
      data: {type},
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};