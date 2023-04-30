import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./src/routes/routes";
import { Server } from "socket.io";
import { createServer } from "http";
import { getPowerStatus } from "./src/utils/mqttServer";
const fs = require("fs");
// nodejs server

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;

app.use("/", router);

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: "*"}});

io.on('connection', async(socket) => {
  
  console.log('A user has connected!');

  let i = 0;
  let counter = 0;
  let power : string[]
  fs.readFile('./src/files/inputTest.txt','utf8', (err : NodeJS.ErrnoException | null, data: any) => {
    if (err) {
      console.error(err);
      return;
    }
    power = data.split(',');
  });

  let isFinished = false; 
  const interval = setInterval(async () => {
    // const data = await getPowerStatus();
    
    if (!isFinished) {
      isFinished = await getPowerStatus(parseInt(power[i+=1]), counter += 1) as boolean;
      console.log("Finished")
    } else {
      // try counting again
      counter = 0;
    }
    console.log(isFinished)
    io.emit('washing_machine', isFinished);
  }, 3000);

  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
    clearInterval(interval)
  });
})
  
httpServer.listen(port, async() => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});