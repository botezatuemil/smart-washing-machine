import { TasmotaPayload } from "../interfaces/index.interface";

const mqtt = require("mqtt");
const fs = require('fs');


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
  password: process.env.mqtt_password

});

const topic: string = "stat/tasmota/STATUS8";
client.on("connect", () => {
  console.log("Connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

export const getPowerStatus = () => {
    return new Promise(resolve => {
        client.on('message', (topic: string, payload: any) => {
            const tasmotaPayload : TasmotaPayload = JSON.parse(payload.toString());
            const content = tasmotaPayload//.StatusSNS.ENERGY.ApparentPower
            
            const message = JSON.stringify(content) + "\n";
            // fs.writeFile('./src/files/09.03.2023.txt', message, {flag : "a+"}, (err : NodeJS.ErrnoException | null) => {
            //     if (err) {
            //         console.log(err);
            //     }
            // });
            resolve(content.StatusSNS.ENERGY.ApparentPower);
        });
    })
}

export const powerSmartPlug = (topic: string, payload: string) => {
 
  client.publish(topic, payload, (error: any) => {
    console.log(payload)
    if (error) {
      console.error(error)
    }
  })
}


