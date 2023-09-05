"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const categories_controller_1 = require("./categories.controller");
const router = express_1.default.Router();
exports.categoriesRouter = router;
router.get("/", categories_controller_1.searchCommandsGeneral);
router.get("/:lang", categories_controller_1.searchCommandsByLanguage);
//# sourceMappingURL=categories.router.js.map