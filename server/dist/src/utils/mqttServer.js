"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerSmartPlug = exports.getPowerStatus = exports.connectToBroker = void 0;
const WashingMachine_controller_1 = require("../controllers/WashingMachine.controller");
const Notifications_1 = require("./Notifications");
const Notification_controller_1 = require("../controllers/Notification.controller");
const mqtt = require("mqtt");
const fs = require("fs");
let powerData = [];
let thresholdStartTime = null;
const connectToBroker = () => {
    const connectUrl = `mqtt://${process.env.mqtt_host}:${process.env.mqtt_port}`;
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
        username: process.env.mqtt_username,
        password: process.env.mqtt_password,
    });
    return client;
};
exports.connectToBroker = connectToBroker;
const getPowerStatus = (expoPushToken, client, topic, user_id, device) => {
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
        client.on("message", (topic, payload) => {
            const identifier = topic.split("/")[1];
            const smart_plug_id = identifier.split("_")[1];
            const tasmotaPayload = JSON.parse(payload.toString());
            const content = tasmotaPayload;
            const powerConsumption = content.StatusSNS.ENERGY.ApparentPower;
            console.log("power", powerConsumption);
            const timestamp = new Date();
            powerData.push({ powerConsumption, timestamp });
            // take the data no more than a minute old in prod
            const thresholdData = powerData.filter(({ timestamp }) => timestamp.valueOf() >= new Date().valueOf() - 10 * 1000);
            // calculate the average power consumption
            const averagePowerConsumption = thresholdData.reduce((sum, { powerConsumption }) => sum + powerConsumption, 0) / thresholdData.length;
            // if it's below a certain threshold, save the time, else do it again, save the null
            if (averagePowerConsumption < 30) {
                if (thresholdStartTime === null) {
                    thresholdStartTime = timestamp;
                }
                // if it passed a whole minute between the current time and the earlier saved time, do that
                if (timestamp.valueOf() - thresholdStartTime.valueOf() >= 10 * 1000) {
                    console.log(timestamp);
                    console.log(thresholdStartTime);
                    (0, exports.powerSmartPlug)(`cmnd/tasmota_${smart_plug_id}/POWER`, "off", client);
                    (0, WashingMachine_controller_1.updateWashingMachineStatus)(parseInt(smart_plug_id));
                    const message = device === "WASHING_MACHINE"
                        ? "Your machine has finished washing!"
                        : "Your dryer has finished!";
                    (0, Notifications_1.sendNotification)(expoPushToken, message, "MACHINE_FINISHED");
                    const notification = {
                        student_id: user_id,
                        title: message,
                        timestamp: new Date(),
                        subtitle: null,
                    };
                    (0, Notification_controller_1.createNotification)(notification);
                    thresholdStartTime = null;
                    client.end();
                }
            }
            else {
                thresholdStartTime = null;
            }
        });
    });
};
exports.getPowerStatus = getPowerStatus;
const powerSmartPlug = (topic, payload, client) => {
    client.publish(topic, payload, (error) => {
        if (error) {
            console.error(error);
        }
    });
};
exports.powerSmartPlug = powerSmartPlug;
//# sourceMappingURL=mqttServer.js.map