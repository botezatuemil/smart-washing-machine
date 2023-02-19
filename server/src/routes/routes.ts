import express from "express";
import { getStudents } from "../controllers/studentController";

const router = express.Router();

router.get('/getStudents', getStudents);

export default router;