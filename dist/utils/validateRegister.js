"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validator_1 = __importDefault(require("validator"));
const validateRegister = (options) => {
    if (!validator_1.default.isEmail(options.email)) {
        return [
            {
                field: "email",
                message: "email invalid",
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "username must be greater than 2",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "cannot include an @",
            },
        ];
    }
    if (options.password.length <= 2) {
        return [
            {
                field: "password",
                message: "password must be greater than 3",
            },
        ];
    }
    return [];
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map