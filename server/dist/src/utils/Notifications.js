"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationList = exports.sendNotification = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const sendNotification = (expoPushToken, message) => {
    const expo = new expo_server_sdk_1.Expo({ accessToken: process.env.ACCESS_TOKEN });
    let chunks = expo.chunkPushNotifications([Object.assign({ to: expoPushToken }, message)]);
    let tickets = [];
    (() => __awaiter(void 0, void 0, void 0, function* () {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
            }
            catch (error) {
                console.error(error);
            }
        }
    }))();
};
exports.sendNotification = sendNotification;
const sendNotificationList = (tokens, device) => {
    const expo = new expo_server_sdk_1.Expo({ accessToken: process.env.ACCESS_TOKEN });
    let messages = [];
    for (let { notification_token, id } of tokens) {
        if (!expo_server_sdk_1.Expo.isExpoPushToken(notification_token)) {
            console.error(`Push token ${notification_token} is not a valid Expo push token`);
            continue;
        }
        messages.push({
            to: notification_token,
            body: device === "WASHING_MACHINE"
                ? "A new washing machine is available!"
                : "A new dryer is available",
            data: { id: id, type: device },
        });
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (() => __awaiter(void 0, void 0, void 0, function* () {
        for (let chunk of chunks) {
            try {
                let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
            }
            catch (error) {
                console.error(error);
            }
        }
    }))();
};
exports.sendNotificationList = sendNotificationList;
//# sourceMappingURL=Notifications.js.map