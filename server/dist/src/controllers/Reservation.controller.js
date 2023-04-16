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
exports.addReservation = exports.getAvailableHours = void 0;
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const ConvertKeys_1 = require("../utils/ConvertKeys");
const prisma = new client_1.PrismaClient();
const MIN_HOUR = 12;
const MAX_HOUR = 25;
const getAvailableHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const option = req.body;
        const sqlDate = (0, moment_1.default)(option.day)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        console.log(option.day);
        const reservations = yield prisma.$queryRaw `SELECT * from reservation where reservation.reservation_date::DATE = ${sqlDate}::DATE order by reservation.start_hour`;
        console.log(reservations);
        const availableHourRanges = [];
        let currentHour = (0, moment_1.default)(option.day).set({ h: MIN_HOUR, m: 0, s: 0 }).utcOffset(0);
        let maxHour = (0, moment_1.default)(option.day).set({ h: MAX_HOUR, m: 0, s: 0 }).utcOffset(0);
        reservations.forEach((interval) => {
            if (interval.start_hour.getTime() - currentHour.valueOf() >= 20 * 60 * 1000) {
                availableHourRanges.push({ startHour: currentHour, endHour: (0, moment_1.default)(interval.start_hour).utcOffset(0) });
            }
            currentHour = (0, moment_1.default)(interval.end_hour).utcOffset(0);
        });
        // Check if there's an available range between the last interval's endHour and the maxHour
        if (maxHour.valueOf() - currentHour.valueOf() >= 20 * 60 * 1000) {
            availableHourRanges.push({ startHour: currentHour, endHour: maxHour });
        }
        console.log(availableHourRanges);
        res.send({ reserve: availableHourRanges });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAvailableHours = getAvailableHours;
const addReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservation } = req.body;
    // get the keys from camel case to snake case to keep consistency across frontend / backend
    const parsedReservation = (0, ConvertKeys_1.parseKeys)(reservation);
    try {
        const addedReservation = yield prisma.reservation.create({ data: parsedReservation });
        const convertedReservation = (0, ConvertKeys_1.convertKeys)(addedReservation);
        res.send({ convertedReservation });
    }
    catch (error) {
        console.log(error);
    }
});
exports.addReservation = addReservation;
//# sourceMappingURL=Reservation.controller.js.map