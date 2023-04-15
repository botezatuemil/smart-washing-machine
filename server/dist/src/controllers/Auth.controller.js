"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email);
        const result = yield prisma.$queryRaw `SELECT * FROM student WHERE email = ${email}`;
        if (result.length === 0) {
            res.status(401).json("Invalid credentials!");
            return;
        }
        if (yield bcrypt_1.default.compare(password, result[0].password)) {
            const token = (0, jsonwebtoken_1.sign)({
                user_id: result[0].id,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
            }, process.env.TOKEN_KEY);
            console.log('====================================');
            console.log(token);
            console.log('====================================');
            res.send(JSON.stringify(token));
        }
        else {
            console.log("Password does not match");
            res.status(400).json("Invalid credentials!");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
//# sourceMappingURL=Auth.controller.js.map