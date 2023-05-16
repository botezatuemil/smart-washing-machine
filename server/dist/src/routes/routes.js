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
router.post('/sendQR', Auth_1.verifyQR, WashingMachine_controller_1.startWashing);
router.post('/addExpoToken', Auth_1.verifyJWT, Student_controller_1.addExpoToken);
router.post('/endReservation', Auth_1.verifyJWT, Reservation_controller_1.endReservation);
exports.default = router;
//# sourceMappingURL=routes.js.map