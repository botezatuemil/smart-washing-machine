import moment from "moment";
import { updateWashingMachineStatus } from "../controllers/WashingMachine.controller";
import { TasmotaPayload } from "../interfaces/index.interface";
import { sendNotification } from "./Notifications";

const mqtt = require("mqtt");
const fs = require("fs");

type PowerData = {
  powerConsumption: number;
  timestamp: Date;
};

let powerData: PowerData[] = [];
let thresholdStartTime: Date | null = null;

// const topic: string = "stat/+/STATUS8";

export const connectToBroker = () => {
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

  return client
}

// export const subscribeToTopic = (topic: string) => {
//   client.on("connect", () => {
//     console.log("Connected");
    
//   });
// }

// export const unsubscribeFromTopic = (topic: string) => {
//   client.unsubscribe(topic, (err: any) => {
//     if (err) {
//       console.error(`Error subscribing to MQTT topic: ${err.message}`);
//       client.removeAllListeners('message');
//       powerData = [];
//       thresholdStartTime = null;
//     } else {
//       console.log(`Unsubscribed from MQTT topic: ${topic}`);
//     }
//   });
// }

export const getPowerStatus = (expoPushToken: string, client: any, topic: string) => {
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
    client.on("message", (topic: string, payload: any) => {
      const identifier = topic.split("/")[1];
      const smart_plug_id = identifier.split("_")[1];
  
      const tasmotaPayload: TasmotaPayload = JSON.parse(payload.toString());
      const content = tasmotaPayload; //.StatusSNS.ENERGY.ApparentPower
  
      const message = JSON.stringify(content) + "\n";
      // fs.writeFile('./src/files/09.03.2023.txt', message, {flag : "a+"}, (err : NodeJS.ErrnoException | null) => {
      //     if (err) {
      //         console.log(err);
      //     }
      // });
  
      const powerConsumption = content.StatusSNS.ENERGY.ApparentPower;
      console.log("power", powerConsumption);
  
      const timestamp = new Date();
      powerData.push({ powerConsumption, timestamp });
  
      // take the data no more than a minute old in prod
      const thresholdData = powerData.filter(
        ({ timestamp }) => timestamp.valueOf() >= new Date().valueOf() - 10 * 1000
      );
  
      // calculate the average power consumption
      const averagePowerConsumption =
        thresholdData.reduce(
          (sum, { powerConsumption }) => sum + powerConsumption,
          0
        ) / thresholdData.length;
  
      // if it's below a certain threshold, save the time, else do it again, save the null, and hope that later the data will be below
      if (averagePowerConsumption < 30) {
        if (thresholdStartTime === null) {
          thresholdStartTime = timestamp;
        }
  
        // if it passed a whole minute between the current time and the earlier saved time, do that
        if (timestamp.valueOf() - thresholdStartTime.valueOf() >= 10 * 1000) {
          powerSmartPlug(`cmnd/tasmota_${smart_plug_id}/POWER`, "off", client);
          updateWashingMachineStatus(parseInt(smart_plug_id));
          const message = {
            body: "Your machine has finished washing!",
            data: { withSome: "data" },
          };
          sendNotification(expoPushToken, message);
          // unsubscribeFromTopic(`stat/tasmota_${smart_plug_id}/STATUS8`);
          client.end();
        }
      } else {
        thresholdStartTime = null;
      }
    });
  });
};

export const powerSmartPlug = (topic: string, payload: string, client: any) => {
  client.publish(topic, payload, (error: any) => {
    console.log(payload);
    if (error) {
      console.error(error);
    }
  });
};
