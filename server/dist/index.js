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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./src/routes/routes"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
require("./jobs/backgroundTasks");
const Chat_controller_1 = require("./src/controllers/Chat.controller");
const ConvertKeys_1 = require("./src/utils/ConvertKeys");
const fs = require("fs");
// nodejs server
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const port = process.env.PORT;
app.use("/", routes_1.default);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on("send message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = (0, ConvertKeys_1.parseKeys)(JSON.parse(data));
        const updatedMessage = yield (0, Chat_controller_1.getUpdatedMessage)(message);
        io.emit("new message", JSON.stringify((0, ConvertKeys_1.convertKeys)(updatedMessage)));
    }));
    socket.on("disconnect", () => {
        console.log("A user has disconnected.");
    });
}));
httpServer.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
}));
//# sourceMappingURL=index.js.map