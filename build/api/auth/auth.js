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
exports.controlRoleUser = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const AppError_1 = require("../manage-errors/AppError");
const users_models_1 = require("../users/users.models");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
/**
 * Check token of FE and getting info of user
 */
exports.validateToken = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Getting token
    let token = "";
    if (req.headers.xen && req.headers.xen.startsWith('Bearer')) {
        token = req.headers.xen.split(' ')[1];
    }
    if (!token) {
        return next(new AppError_1.AppError("Need to login in application web", constants_1.httpCodes.unauthorized));
    }
    // 2) Verification token
    // @ts-ignore
    const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.KEY_JWT);
    // @ts-ignore
    const currentUser = yield users_models_1.UsersModel.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError_1.AppError("This user doesn't exit yet", constants_1.httpCodes.bad_request));
    }
    // Store user to use next routes
    req.user = currentUser;
    next();
}));
exports.controlRoleUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1ª Get role of user
    const role = req.user.role;
    if (role === constants_1.userRoles.GUEST) {
        return next(new AppError_1.AppError("Action forbidden", constants_1.httpCodes.forbidden));
    }
    next();
}));
//# sourceMappingURL=auth.js.map