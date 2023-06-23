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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getNotifications = exports.createNotifications = exports.createNotification = void 0;
const client_1 = require("@prisma/client");
const ConvertKeys_1 = require("../utils/ConvertKeys");
const prisma = new client_1.PrismaClient();
const createNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.notifications.create({
            data: notification,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createNotification = createNotification;
const createNotifications = (notifications) => {
    try {
        notifications.map((notification) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.notifications.create({
                data: notification,
            });
        }));
    }
    catch (error) {
        console.log(error);
    }
};
exports.createNotifications = createNotifications;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = res.locals.user_id;
    try {
        const notifications = yield prisma.$queryRaw `select * from notifications where notifications.student_id = ${user_id}`;
        res.send((0, ConvertKeys_1.convertKeysArray)(notifications));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getNotifications = getNotifications;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        console.log(id);
        yield prisma.$queryRaw `delete from notifications where notifications.id = ${id}`;
        res.status(200).json("Notification deleted successfully!");
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=Notification.controller.js.map