import { Expo } from "expo-server-sdk";

export type Notification = {
    body: string;
    data: {withSome: string};
}

export const sendNotification = (expoPushToken: string, message: Notification) => {
    const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });

    let chunks = expo.chunkPushNotifications([{ to: expoPushToken, ...message }]);
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
}