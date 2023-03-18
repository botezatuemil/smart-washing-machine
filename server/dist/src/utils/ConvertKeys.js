"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKeysArray = exports.convertKeys = void 0;
const lodash_1 = __importDefault(require("lodash"));
const convertKeys = (object) => {
    return lodash_1.default.mapKeys(object, (value, key) => lodash_1.default.camelCase(key));
};
exports.convertKeys = convertKeys;
const convertKeysArray = (arrayObjects) => {
    return arrayObjects.map(object => {
        return lodash_1.default.mapKeys(object, (value, key) => lodash_1.default.camelCase(key));
    });
};
exports.convertKeysArray = convertKeysArray;
