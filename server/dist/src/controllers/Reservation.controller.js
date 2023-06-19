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
exports.scheduleEarly = exports.updateReservationTime = exports.deleteReservation = exports.endReservation = exports.getIncomingReservation = exports.getHistory = exports.addReservation = exports.getAvailableHours = void 0;
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const ConvertKeys_1 = require("../utils/ConvertKeys");
const Notifications_1 = require("../utils/Notifications");
const prisma = new client_1.PrismaClient();
const MIN_HOUR = 12;
const MAX_HOUR = 24;
const getAvailableHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const option = req.body;
        const sqlDate = (0, moment_1.default)(option.day)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        // console.log(option.day);
        const reservations = yield prisma.$queryRaw `SELECT * from reservation where reservation.reservation_date::DATE = ${sqlDate}::DATE order by reservation.start_hour`;
        const availableHourRanges = [];
        let currentHour = (0, moment_1.default)(option.day)
            .set({ h: MIN_HOUR, m: 0, s: 0 })
            .utcOffset(0);
        let maxHour = (0, moment_1.default)(option.day)
            .set({ h: MAX_HOUR, m: 0, s: 0 })
            .utcOffset(0);
        reservations.forEach((interval) => {
            if (interval.start_hour.getTime() - currentHour.valueOf() >=
                20 * 60 * 1000) {
                availableHourRanges.push({
                    startHour: currentHour,
                    endHour: (0, moment_1.default)(interval.start_hour).utcOffset(0),
                });
            }
            currentHour = (0, moment_1.default)(interval.end_hour).utcOffset(0);
        });
        // Check if there's an available range between the last interval's endHour and the maxHour
        if (maxHour.valueOf() - currentHour.valueOf() >= 20 * 60 * 1000) {
            availableHourRanges.push({ startHour: currentHour, endHour: maxHour });
        }
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
    console.log(reservation);
    const parsedReservation = (0, ConvertKeys_1.parseKeys)(reservation);
    try {
        const addedReservation = yield prisma.reservation.create({
            data: parsedReservation,
        });
        const reservationStore = yield prisma.$queryRaw `SELECT laundry.laundry_name, laundry.laundry_floor, reservation.*,
    washing_device.device_name, washing_device.type FROM reservation 
    INNER JOIN laundry on  laundry.id = ${addedReservation.laundry_id}
    INNER JOIN washing_device on  washing_device.id = ${addedReservation.washing_device_id}
    WHERE reservation.id = ${addedReservation.id}`;
        const convertedReservation = (0, ConvertKeys_1.convertKeys)(reservationStore[0]);
        // console.log(convertedReservation);
        res.send(convertedReservation);
    }
    catch (error) {
        console.log(error);
    }
});
exports.addReservation = addReservation;
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const reservationStore = yield prisma.$queryRaw `SELECT laundry.laundry_name, laundry.laundry_floor, reservation.*,
    washing_device.device_name, washing_device.type FROM reservation
    INNER JOIN laundry on  laundry.id = reservation.laundry_id
    INNER JOIN washing_device on  washing_device.id = reservation.washing_device_id
    WHERE reservation.student_id = ${id}`;
        res.send((0, ConvertKeys_1.convertKeysArray)(reservationStore));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getHistory = getHistory;
const getIncomingReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = res.locals.user_id;
    try {
        const reservationStore = yield prisma.$queryRaw `SELECT laundry.laundry_name, laundry.laundry_floor,reservation.*,
      washing_device.device_name, washing_device.type, washing_device.status, washing_device.student_id as washing_device_student_id,  washing_device.opened FROM reservation
      INNER JOIN laundry on  laundry.id = reservation.laundry_id
      INNER JOIN washing_device on  washing_device.id = reservation.washing_device_id
      WHERE reservation.student_id = ${user_id}
      AND reservation.start_hour::timestamp >= (NOW() AT TIME ZONE 'Europe/Bucharest')
      ORDER BY reservation.reservation_date::DATE DESC, reservation.start_hour ASC  LIMIT 1`;
        console.log((0, ConvertKeys_1.convertKeys)(reservationStore[0]));
        res.send((0, ConvertKeys_1.convertKeys)(reservationStore[0]));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getIncomingReservation = getIncomingReservation;
const endReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservationId } = req.body;
    const user_id = res.locals.user_id;
    try {
        yield prisma.$queryRaw `UPDATE washing_device set opened = true from reservation
    where reservation.washing_device_id = washing_device.id
    and reservation.id = ${reservationId}`;
        const tokens = yield prisma.$queryRaw `SELECT student.notification_token, student.id from student where 
    student.id <> ${user_id}`;
        const newTokens = tokens.map(({ id, notification_token }) => ({
            id: user_id,
            notification_token,
        }));
        const wash = yield prisma.$queryRaw `SELECT reservation.washing_device_id from reservation where reservation.id = ${reservationId}`;
        const device = yield prisma.$queryRaw `SELECT washing_device.type from washing_device where washing_device.id = ${wash[0].washing_device_id}`;
        const deletedReservation = yield prisma.$queryRaw `select * from reservation where reservation.id = ${reservationId}`;
        yield prisma.$queryRaw `DELETE from reservation where reservation.id = ${reservationId}`;
        const message = device[0].type === "WASHING_MACHINE"
            ? "A new washing machine is available!"
            : "A new dryer is available";
        (0, Notifications_1.sendNotificationList)(newTokens, message);
        (0, exports.scheduleEarly)((0, moment_1.default)(), moment_1.default.utc(deletedReservation[0].end_hour));
    }
    catch (error) {
        console.log(error);
    }
});
exports.endReservation = endReservation;
const deleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservationId } = req.body;
    try {
        const deletedReservation = yield prisma.$queryRaw `select * from reservation where reservation.id = ${reservationId}`;
        yield prisma.$queryRaw `delete from reservation where reservation.id = ${reservationId}`;
        (0, exports.scheduleEarly)(moment_1.default.utc(deletedReservation[0].start_hour), moment_1.default.utc(deletedReservation[0].end_hour));
        res.status(200).json("Reservation deleted successfully");
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteReservation = deleteReservation;
const getValue = (interval) => {
    let startHour = interval.start_hour.getTime();
    let endHour = interval.end_hour.getTime();
    return Math.floor((endHour - startHour) / (1000 * 60));
};
const updateReservationTime = (reservationId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlStartDate = startDate.format("YYYY-MM-DD HH:mm:ss");
        const sqlEndDate = endDate.format("YYYY-MM-DD HH:mm:ss");
        yield prisma.$queryRaw `update reservation set start_hour = ${sqlStartDate}::timestamp, end_hour = ${sqlEndDate}::timestamp where reservation.id = ${reservationId}`;
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateReservationTime = updateReservationTime;
const getTokenById = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.$queryRaw `select student.notification_token from student where student.id = ${studentId}`;
        return result[0].notification_token;
    }
    catch (error) {
        console.log(error);
    }
});
const scheduleEarly = (startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const intervals = yield prisma.$queryRaw `SELECT * from reservation where reservation.scheduled_early = true and reservation.start_hour > ${startTime}::timestamp`;
        if (intervals.length === 0) {
            return;
        }
        const sortedIntervals = intervals.sort((r1, r2) => r1.end_hour.getTime() - r1.start_hour.getTime() <
            r2.end_hour.getTime() - r2.start_hour.getTime()
            ? -1
            : 1);
        let n = sortedIntervals.length;
        let intervalLength = Math.floor(endTime.diff(startTime, "minutes"));
        console.log(intervalLength);
        let dp = Array.from({ length: n + 1 }, () => new Array(intervalLength + 1).fill(0));
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= intervalLength; j++) {
                if (getValue(sortedIntervals[i - 1]) <= j) {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - getValue(sortedIntervals[i - 1])] +
                        getValue(sortedIntervals[i - 1]));
                }
                else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }
        // Determine the scheduled reservations by looking if it was inclued or not in the current optimal, and if it is go to the remaining interval and repeat
        let scheduledReservations = [];
        let i = n, j = intervalLength;
        while (i > 0 && j > 0) {
            if (dp[i][j] != dp[i - 1][j]) {
                scheduledReservations.push(sortedIntervals[i - 1]);
                j -= getValue(sortedIntervals[i - 1]);
            }
            i--;
        }
        let start = startTime;
        for (let reservation of scheduledReservations.reverse()) {
            let end = start.clone().add(getValue(reservation), "minutes");
            // Update the time of the reservation
            (0, exports.updateReservationTime)(reservation.id, start, end);
            const message = "Your reservation has been scheduled early from: " +
                (0, moment_1.default)(start).format("YYYY-MM-DD hh:mm") +
                " to " +
                (0, moment_1.default)(end).format("YYYY-MM-DD hh:mm");
            (0, Notifications_1.sendNotification)(yield getTokenById(reservation.student_id), message);
            // The start time for the next reservation is the end time of the current one
            start = end;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.scheduleEarly = scheduleEarly;
//# sourceMappingURL=Reservation.controller.js.map