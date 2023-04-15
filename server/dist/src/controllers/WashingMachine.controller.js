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
exports.updateWashingMachineStatus = exports.getDevicesSelect = exports.getLaundryDevices = void 0;
const client_1 = require("@prisma/client");
const ConvertKeys_1 = require("../utils/ConvertKeys");
const ConvertTypes_1 = require("../utils/ConvertTypes");
const prisma = new client_1.PrismaClient();
const getLaundryDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { option } = req.body;
    const convertedDeviceType = (0, ConvertTypes_1.convertTypes)(option);
    const laundryData = yield prisma.$queryRaw `
        SELECT washing_device.id, device_name as washing_device_name, status, opened, laundry_id, type, student_id, first_name, last_name, dorm_id, dorm_number,
        dorm_floor, laundry_floor, dorm.id FROM washing_device
        INNER JOIN laundry on laundry.id = washing_device.laundry_id
        INNER JOIN student on student.id =  washing_device.student_id
        INNER JOIN dorm on dorm.id = student.dorm_id
        WHERE ${convertedDeviceType}::device = type
        GROUP BY washing_device.id, student.first_name, student.last_name, student.dorm_id, dorm.dorm_number, dorm.dorm_floor, laundry.laundry_floor, dorm.id
    `;
    console.log(laundryData);
    res.send((0, ConvertKeys_1.convertKeysArray)(laundryData));
});
exports.getLaundryDevices = getLaundryDevices;
const getDevicesSelect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { option } = req.body;
        const convertedDeviceType = (0, ConvertTypes_1.convertTypes)(option);
        const washing_device = yield prisma.$queryRaw `SELECT * from washing_device where washing_device.type = ${convertedDeviceType}::device`;
        res.send((0, ConvertKeys_1.convertKeysArray)(washing_device));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getDevicesSelect = getDevicesSelect;
const updateWashingMachineStatus = () => { };
exports.updateWashingMachineStatus = updateWashingMachineStatus;
//# sourceMappingURL=WashingMachine.controller.js.map