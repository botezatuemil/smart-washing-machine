import express from "express";
import { getStudents } from "../controllers/Student.controller";
import { login } from "../controllers/Auth.controller";
import { getDevicesSelect, getLaundryDevices } from "../controllers/WashingMachine.controller";
import { getLaundries } from "../controllers/Laundry.controller";
import { addReservation, getAvailableHours, getHistory, getIncomingReservation } from "../controllers/Reservation.controller";
import { verifyJWT } from "../middleware/Auth";

const router = express.Router();

router.get('/getStudents', getStudents);
router.post('/login', login);
router.post('/getLaundryDevices', getLaundryDevices)
router.get('/getLaundries', getLaundries)
router.post('/getDevicesSelect', getDevicesSelect)
router.post('/getAvailableHours', getAvailableHours);
router.post('/addReservation', addReservation);
router.post('/getHistory', getHistory);
router.get('/getIncomingReservation', verifyJWT, getIncomingReservation);

export default router;