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
exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connect to MongoDB
 */
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataBase = process.env.DATABASE || "";
        // if(process.env.NODE_ENV === "production"){
        dataBase = dataBase.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
        // }
        // Disable warning in mongoose version 8
        mongoose_1.default.set("strictQuery", true);
        //@ts-ignore
        yield mongoose_1.default.connect(dataBase);
        console.log("[bbdd] online");
    }
    catch (error) {
        console.log("[error bbdd connect] ", error);
        console.log("[bbdd] offline");
    }
});
exports.dbConnection = dbConnection;
//# sourceMappingURL=database.config.js.map