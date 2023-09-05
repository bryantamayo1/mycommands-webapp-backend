"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const auth_1 = require("../auth/auth");
const router = express_1.default.Router();
exports.userRouter = router;
router.post("/login", users_controller_1.login);
router.post("/register", auth_1.validateToken, users_controller_1.register);
//# sourceMappingURL=users.router.js.map