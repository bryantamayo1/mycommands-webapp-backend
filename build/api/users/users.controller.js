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
exports.register = exports.login = void 0;
const utils_1 = require("../utils/utils");
const users_models_1 = require("./users.models");
const constants_1 = require("../utils/constants");
const util_1 = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../manage-errors/AppError");
exports.login = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError_1.AppError("Email or password are missing", constants_1.httpCodes.bad_request));
    }
    // 2) Check if user exists && password are corrects
    const user = yield users_models_1.UsersModel.findOne({ email }).select("+password -createdAt -updatedAt");
    if (!user || !(yield user.checkPassword(password, user.password))) {
        return next(new AppError_1.AppError("Email or password aren't right", constants_1.httpCodes.bad_request));
    }
    // 3) Create token
    // @ts-ignore
    const token = yield (0, util_1.promisify)(jsonwebtoken_1.default.sign)({ id: user.id }, process.env.KEY_JWT, { expiresIn: process.env.EXPIRE_TIME_JWT });
    const newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    // delete newUser._id;
    return res.json({
        status: "success",
        data: Object.assign(Object.assign({}, newUser), { xen: token })
    });
}));
exports.register = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password, passwordConfirm, role } = req.body;
    // Validations
    if ((0, utils_1.bodyIsEmpty)(req.body)) {
        return next(new AppError_1.AppError("Body is empty", constants_1.httpCodes.bad_request));
    }
    // Check password of FE
    if (password !== passwordConfirm) {
        return next(new AppError_1.AppError("Passwords aren't the same", constants_1.httpCodes.bad_request));
    }
    // Find email or userName exists already on BE
    const userExists = yield users_models_1.UsersModel.find({ $or: [{ userName }, { email }] });
    if (userExists.length > 0) {
        return next(new AppError_1.AppError("User or email exists yet", constants_1.httpCodes.bad_request));
    }
    // Create new user
    yield users_models_1.UsersModel.create({
        userName,
        email,
        password,
        passwordConfirm,
        role
    });
    return res.status(constants_1.httpCodes.created).json({
        status: "success",
    });
}));
//# sourceMappingURL=users.controller.js.map