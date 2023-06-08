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
exports.getProfile = exports.addExpoToken = exports.getStudents = void 0;
const client_1 = require("@prisma/client");
const ConvertKeys_1 = require("../utils/ConvertKeys");
const prisma = new client_1.PrismaClient();
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.$queryRaw `SELECT * FROM student`;
        res.send(JSON.stringify(students));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getStudents = getStudents;
const addExpoToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { expoToken } = req.body;
    const user_id = res.locals.user_id;
    console.log("token", expoToken);
    console.log("user", user_id);
    try {
    }
    catch (error) {
    }
});
exports.addExpoToken = addExpoToken;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = res.locals.user_id;
    try {
        const profile = yield prisma.$queryRaw `
    select student.first_name, student.last_name, student.email ,
     dorm.dorm_number as dorm_number, dorm.dorm_floor , building.number as building, campus.name as campus from student
    inner join dorm on dorm.id = student.dorm_id
    inner join building on building.id = dorm.building_id
    inner join campus on campus.id = building.campus_id
    where student.id = ${user_id}`;
        res.send((0, ConvertKeys_1.convertKeys)(profile[0]));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getProfile = getProfile;
//# sourceMappingURL=Student.controller.js.map