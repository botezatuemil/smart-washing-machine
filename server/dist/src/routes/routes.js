"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Student_controller_1 = require("../controllers/Student.controller");
const Auth_controller_1 = require("../controllers/Auth.controller");
const WashingMachine_controller_1 = require("../controllers/WashingMachine.controller");
const router = express_1.default.Router();
router.get('/getStudents', Student_controller_1.getStudents);
router.post('/login', Auth_controller_1.login);
router.post('/getLaundryDevices', WashingMachine_controller_1.getLaundryDevices);
exports.default = router;
