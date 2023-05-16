import express from "express";
import { addExpoToken, getStudents } from "../controllers/Student.controller";
import { login } from "../controllers/Auth.controller";
import { getDevicesSelect, getLaundryDevices, startWashing } from "../controllers/WashingMachine.controller";
import { getLaundries } from "../controllers/Laundry.controller";
import { addReservation, getAvailableHours, getHistory, getIncomingReservation, endReservation } from "../controllers/Reservation.controller";
import { verifyJWT, verifyQR } from "../middleware/Auth";

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
router.post('/sendQR', verifyQR, startWashing);
router.post('/addExpoToken', verifyJWT, addExpoToken);
router.post('/endReservation', verifyJWT, endReservation);
export default router;