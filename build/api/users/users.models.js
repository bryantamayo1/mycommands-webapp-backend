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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../utils/constants");
// any to avoid type method checkPassword
const UsersSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: [true, "UserName is compulsory"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is compulsory"],
        unique: true,
        trim: true,
        validate: {
            validator: function (email) {
                return /^\S+@\S+\.\S+$/.test(email);
            },
            message: (props) => `${props.value} isn't a right email`
        }
    },
    password: {
        type: String,
        required: [true, "Password is compulsory"],
        minLength: [8, "Password must have more 7 characters"],
        select: false
    },
    role: {
        type: String,
        enum: [constants_1.userRoles.ADMIN, constants_1.userRoles.USER, constants_1.userRoles.GUEST],
        default: "user"
    }
}, {
    timestamps: true
});
// Middlewares
UsersSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Save password
        this.password = yield bcryptjs_1.default.hash(this.password, +process.env.SALT_BCRYPTJS);
        next();
    });
});
// Methods
/**
 * Check passwoord of FE with password of BE
 * @param passwordToCheck
 * @param passwordInBe
 * @returns Promise with true or false if callback has been omited
 */
UsersSchema.methods.checkPassword = function (passwordToCheck, passwordInBe) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(passwordToCheck, passwordInBe);
    });
};
UsersSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v } = _a, user = __rest(_a, ["__v"]);
    return user;
};
const UsersModel = (0, mongoose_1.model)("user", UsersSchema);
exports.UsersModel = UsersModel;
//# sourceMappingURL=users.models.js.map