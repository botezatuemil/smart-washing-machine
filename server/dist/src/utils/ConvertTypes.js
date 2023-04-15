"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTypes = void 0;
const client_1 = require("@prisma/client");
const convertTypes = (deviceType) => {
    if (deviceType === "washing machine") {
        return client_1.device.WASHING_MACHINE;
    }
    return client_1.device.TUMBLE_DRYER;
};
exports.convertTypes = convertTypes;
//# sourceMappingURL=ConvertTypes.js.map