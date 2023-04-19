"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDifference = void 0;
const moment_1 = __importDefault(require("moment"));
const calculateDifference = (date) => {
    const difference = -date.getTimezoneOffset() / 60;
    console.log(difference);
    return (0, moment_1.default)(date);
};
exports.calculateDifference = calculateDifference;
//# sourceMappingURL=Timezone.js.map