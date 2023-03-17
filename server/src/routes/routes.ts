import express from "express";
import { getStudents } from "../controllers/studentController";
import { login } from "../controllers/authController";
import { getLaundryDevices } from "../controllers/washingMachineController";
const router = express.Router();

router.get('/getStudents', getStudents);
router.post('/login', login);
router.post('/getLaundryDevices', getLaundryDevices)

export default router;