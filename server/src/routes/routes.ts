import express from "express";
import { getStudents } from "../controllers/Student.controller";
import { login } from "../controllers/Auth.controller";
import { getLaundryDevices } from "../controllers/WashingMachine.controller";
const router = express.Router();

router.get('/getStudents', getStudents);
router.post('/login', login);
router.post('/getLaundryDevices', getLaundryDevices)

export default router;