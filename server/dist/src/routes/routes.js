"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Student_controller_1 = require("../controllers/Student.controller");
const Auth_controller_1 = require("../controllers/Auth.controller");
const WashingMachine_controller_1 = require("../controllers/WashingMachine.controller");
const Laundry_controller_1 = require("../controllers/Laundry.controller");
const Reservation_controller_1 = require("../controllers/Reservation.controller");
const Auth_1 = require("../middleware/Auth");
const router = express_1.default.Router();
router.get('/getStudents', Student_controller_1.getStudents);
router.post('/login', Auth_controller_1.login);
router.post('/getLaundryDevices', WashingMachine_controller_1.getLaundryDevices);
router.get('/getLaundries', Laundry_controller_1.getLaundries);
router.post('/getDevicesSelect', WashingMachine_controller_1.getDevicesSelect);
router.post('/getAvailableHours', Reservation_controller_1.getAvailableHours);
router.post('/addReservation', Reservation_controller_1.addReservation);
router.post('/getHistory', Reservation_controller_1.getHistory);
router.get('/getIncomingReservation', Auth_1.verifyJWT, Reservation_controller_1.getIncomingReservation);
exports.default = router;
//# sourceMappingURL=routes.js.map