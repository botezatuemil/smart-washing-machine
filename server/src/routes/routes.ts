import express from "express";
import { getStudents } from "../controllers/Student.controller";
import { login } from "../controllers/Auth.controller";
import { getLaundryDevices } from "../controllers/WashingMachine.controller";
import { getLaundries } from "../controllers/Laundry.controller";
const router = express.Router();

router.get('/getStudents', getStudents);
router.post('/login', login);
router.post('/getLaundryDevices', getLaundryDevices)
router.get('/getLaundries', getLaundries)

export default router;