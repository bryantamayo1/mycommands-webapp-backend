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
exports.updateCounterPage = void 0;
const infoPage_model_1 = require("./infoPage.model");
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../utils/utils");
/**
 * Get web page’s info
 * Update counter of web page for each month individually
 */
exports.updateCounterPage = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const field = (0, moment_1.default)().format("MM-YYYY");
    const counter = `{
        "${field}": 1
    }`;
    const counterObject = JSON.parse(counter);
    // Increment in 1
    const result = yield infoPage_model_1.InfoPageModel.updateOne({ $inc: counterObject });
    // In case that doesn''t exist date, then create a new date
    if (!result.matchedCount) {
        yield infoPage_model_1.InfoPageModel.create(counterObject);
        return res.json({
            status: "success"
        });
    }
    else {
        return res.json({
            status: "success"
        });
    }
}));
//# sourceMappingURL=infoPage.controller.js.map