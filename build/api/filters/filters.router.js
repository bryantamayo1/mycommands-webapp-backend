"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtersRouter = void 0;
const express_1 = __importDefault(require("express"));
const filters_controller_1 = require("./filters.controller");
const router = express_1.default.Router();
exports.filtersRouter = router;
// Not use process.env.PATH_ADMIN doesn't work here
router.get("/:lang", filters_controller_1.findFilters);
//# sourceMappingURL=filters.router.js.map