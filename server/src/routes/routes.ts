import express from "express";
import { getProfile } from "../controllers/Student.controller";
import { login } from "../controllers/Auth.controller";
import {
  getDevicesSelect,
  getLaundryDevices,
  startWashing,
} from "../controllers/WashingMachine.controller";
import { getLaundries } from "../controllers/Laundry.controller";
import {
  addReservation,
  getAvailableHours,
  getHistory,
  getIncomingReservation,
  endReservation,
  deleteReservation,
} from "../controllers/Reservation.controller";
import {
  getConversations,
  getMessages,
  createChat,
} from "../controllers/Chat.controller";
import { verifyJWT, verifyQR } from "../middleware/Auth";
import {
  getNotifications,
  deleteNotification,
} from "../controllers/Notification.controller";

const router = express.Router();

router.post("/login", login);
router.post("/getLaundryDevices", getLaundryDevices);
router.get("/getLaundries", getLaundries);
router.post("/getDevicesSelect", getDevicesSelect);
router.post("/getAvailableHours", getAvailableHours);
router.post("/addReservation", addReservation);
router.post("/getHistory", getHistory);
router.get("/getIncomingReservation", verifyJWT, getIncomingReservation);
router.post("/sendQR", verifyQR, startWashing);
router.post("/endReservation", verifyJWT, endReservation);
router.get("/getConversations", verifyJWT, getConversations);
router.post("/getMessages", verifyJWT, getMessages);
router.post("/createChat", verifyJWT, createChat);
router.get("/getNotifications", verifyJWT, getNotifications);
router.post("/deleteNotification", verifyJWT, deleteNotification);
router.get("/getProfile", verifyJWT, getProfile);
router.post("/deleteReservation", verifyJWT, deleteReservation);
export default router;
