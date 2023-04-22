"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyQR = exports.verifyJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyJWT = (req, res, next) => {
    const bearerToken = req.headers["x-access-token"];
    if (!bearerToken) {
        res.send("Permission not authorized without token");
    }
    else {
        try {
            (0, jsonwebtoken_1.verify)(bearerToken, process.env.TOKEN_KEY, (err, decoded) => {
                if (err) {
                    console.log(err);
                    res.send("Failed to authenticate");
                }
                else {
                    res.locals.user_id = decoded.user_id;
                    next();
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.verifyJWT = verifyJWT;
const verifyQR = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.send("Permission not authorized without scanning!");
    }
    else {
        try {
            if (process.env.QR_KEY !== token) {
                res.send("Failed to authenticate");
            }
            else {
                next();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.verifyQR = verifyQR;
//# sourceMappingURL=Auth.js.map