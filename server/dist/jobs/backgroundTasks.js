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
const prisma = new client_1.PrismaClient();
// delete if the reservation has not been scanned
// delete if the end hour is lower than the now, but only if the user has taken his clothes (opened = true)
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield prisma.$queryRaw `select reservation.* from reservation
    inner join washing_device on  washing_device.id = reservation.washing_device_id
    and reservation.start_hour::timestamp < (NOW() AT TIME ZONE 'Europe/Bucharest' - INTERVAL '10' MINUTE) 
    and reservation.end_hour > NOW() AT TIME ZONE 'Europe/Bucharest' 
    and washing_device.status = true 
    `;
        // or reservation.end_hour < NOW() AT TIME ZONE 'Europe/Bucharest'
        // and washing_device.opened = true
        if (reservations.length !== 0) {
            reservations.map((reservation) => __awaiter(void 0, void 0, void 0, function* () {
                // await prisma.$queryRaw`delete from reservation where reservation.id = ${reservation.id}`;
                console.log("Found expired ", reservations);
            }));
        }
        else {
            console.log("Every thing up to date!");
        }
    }
    catch (error) {
        console.log(error);
    }
}));
//# sourceMappingURL=backgroundTasks.js.map