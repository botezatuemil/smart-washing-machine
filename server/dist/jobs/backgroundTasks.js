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
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const prisma = new client_1.PrismaClient();
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const currentHour = (0, moment_1.default)().utc().subtract(10, "minutes").toISOString();
    console.log(currentHour);
    try {
        const reservations = yield prisma.$queryRaw `select * from reservation where reservation.start_hour::timestamp < (NOW() AT TIME ZONE 'Europe/Bucharest' - INTERVAL '10' MINUTE)`;
        if (reservations.length !== 0) {
            reservations.map((reservation) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.$queryRaw `delete from reservation where reservation.id = ${reservation.id}`;
                console.log("delete", reservation.id);
            }));
        }
    }
    catch (error) {
        console.log(error);
    }
}));
//# sourceMappingURL=backgroundTasks.js.map