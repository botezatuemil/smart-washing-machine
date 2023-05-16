import { Expo } from "expo-server-sdk";

export type Notification = {
    body: string;
    data: {id: string, type: "WASHING_MACHINE" | "TUMBLE_DRYER"};
}

export type ExpoTokenList = {
  id : number;
  notification_token: string;
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

export const sendNotificationList = (tokens : ExpoTokenList[], device: "WASHING_MACHINE" | "TUMBLE_DRYER") => {
  const expo = new Expo({ accessToken: process.env.ACCESS_TOKEN });
  let messages = [];
  for (let {notification_token, id} of tokens) {
  
    if (!Expo.isExpoPushToken(notification_token)) {
      console.error(`Push token ${notification_token} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: notification_token,
      body: device === "WASHING_MACHINE" ? 'A new washing machine is available!' : 'A new dryer is available',
      data: { id: id, type: device },
    })
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
}