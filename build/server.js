"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_config_1 = require("./api/server/server.config");
const dotenv_1 = __importDefault(require("dotenv"));
// Manage error
process.on("uncaughtException", (err, origin) => {
    console.log("[UNCAUGHT EXCEPTION] 💥 Shutting down...");
    console.log({
        staus: "error",
        name: err.name,
        message: err.message,
        stack: err.stack,
        origin: origin
    });
    // Node.js will finish all synchronous processes
    process.exit(1);
});
// Setup environment
if (process.env.NODE_ENV === 'development') {
    dotenv_1.default.config({ path: "./.env.development.local" });
    console.log("[SO] " + process.env.SO);
    console.log("[mode] " + process.env.NODE_ENV);
}
else {
    if (process.env.SO !== 'linux') {
        dotenv_1.default.config({ path: "./.env.production.local" });
    }
    console.log("[SO] " + process.env.SO);
    console.log("[mode] " + process.env.NODE_ENV);
}
const server = new server_config_1.Server();
server.execute();
//# sourceMappingURL=server.js.map