import express from "express";
import { getStudents } from "../controllers/studentController";
import { login } from "../controllers/authController";
const router = express.Router();

router.get('/getStudents', getStudents);
router.post('/login', login)

export default router;