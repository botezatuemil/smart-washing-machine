import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./src/routes/routes";
import { Server } from "socket.io";
import { createServer } from "http";
import "./jobs/backgroundTasks";
import { messages } from "@prisma/client";
import { getUpdatedMessage } from "./src/controllers/Chat.controller";
import { convertKeys, parseKeys } from "./src/utils/ConvertKeys";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;

app.use("/", router);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", async (socket) => {
  socket.on("send message", async (data) => {
    const message = parseKeys(JSON.parse(data) )as Omit<messages, "id">;
    const updatedMessage = await getUpdatedMessage(message);

    io.emit("new message", JSON.stringify(convertKeys(updatedMessage)));
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });
});

httpServer.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
