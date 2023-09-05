"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoPageRouter = void 0;
const express_1 = __importDefault(require("express"));
const infoPage_controller_1 = require("./infoPage.controller");
const router = express_1.default.Router();
exports.infoPageRouter = router;
router.get("/", infoPage_controller_1.updateCounterPage);
//# sourceMappingURL=infoPage.router.js.map