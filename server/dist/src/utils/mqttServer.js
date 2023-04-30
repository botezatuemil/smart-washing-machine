"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerSmartPlug = exports.getPowerStatus = void 0;
const WashingMachine_controller_1 = require("../controllers/WashingMachine.controller");
const mqtt = require("mqtt");
const fs = require("fs");
const host = "localhost";
const mqttPort = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${mqttPort}`;
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    username: process.env.mqtt_username,
    password: process.env.mqtt_password,
});
const topic = "stat/+/STATUS8";
client.on("connect", () => {
    console.log("Connected");
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
    });
});
const getPowerStatus = (energyConsumption, counter) => {
    return new Promise((resolve) => {
        client.on("message", (topic, payload) => {
            const identifier = topic.split('/')[1];
            const smart_plug_id = identifier.split('_')[1];
            const tasmotaPayload = JSON.parse(payload.toString());
            const content = tasmotaPayload; //.StatusSNS.ENERGY.ApparentPower
            const message = JSON.stringify(content) + "\n";
            // fs.writeFile('./src/files/09.03.2023.txt', message, {flag : "a+"}, (err : NodeJS.ErrnoException | null) => {
            //     if (err) {
            //         console.log(err);
            //     }
            // }); 
            //  const energyConsumption = content.StatusSNS.ENERGY.ApparentPower;
            console.log("power", energyConsumption);
            console.log("index", counter);
            // data comes at every 3 seconds from the smart plug, so we check if more than 20 power indexes are below 20W
            // in a minute
            if (counter >= 20 && energyConsumption <= 20) {
                (0, WashingMachine_controller_1.updateWashingMachineStatus)(parseInt(smart_plug_id));
                resolve(true);
            }
            else if (energyConsumption > 20) {
                resolve(false);
            }
        });
    });
};
exports.getPowerStatus = getPowerStatus;
const powerSmartPlug = (topic, payload) => {
    client.publish(topic, payload, (error) => {
        console.log(payload);
        if (error) {
            console.error(error);
        }
    });
};
exports.powerSmartPlug = powerSmartPlug;
//# sourceMappingURL=mqttServer.js.map