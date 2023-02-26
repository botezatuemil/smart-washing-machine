import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./src/routes/routes";
import { TasmotaPayload } from "./src/interfaces/index.interface";
import { Server } from "socket.io";
import { createServer } from "http";
import { getPowerStatus } from "./src/utils/mqttServer";
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

  const data = await getPowerStatus();
  console.log(data);

  // socket.on('washing_machine', async() => {
  //   io.emit('washing_machine', data);
  // });

  io.emit('washing_machine', data);

  socket.on('disconnect', () => {
    console.log('A user has disconnected.');
  });
})

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// mqtt server   



// socket.io server



