"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/getStudents', studentController_1.getStudents);
router.post('/login', authController_1.login);
exports.default = router;
