"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const database_config_1 = require("../database/database.config");
const categories_router_1 = require("../categories/categories.router");
const filters_router_1 = require("../filters/filters.router");
const users_router_1 = require("../users/users.router");
const constants_1 = require("../utils/constants");
const handle_errors_1 = require("../manage-errors/handle-errors");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const AppError_1 = require("../manage-errors/AppError");
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const auth_1 = require("../auth/auth");
const filters_controller_1 = require("../filters/filters.controller");
const categories_controller_1 = require("../categories/categories.controller");
const http_1 = __importDefault(require("http"));
const subCategories_router_1 = require("../subCategories/subCategories.router");
const infoPage_router_1 = require("../infoPage/infoPage.router");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../docu/swagger.json"));
const xss = require('xss-clean');
class Server {
    constructor() {
        this.urlApi = "/api/v1";
        // Server
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        // Connect DB
        this.connectDB();
        // Middlewares
        this.middlewares();
        // Routes
        this.routes();
    }
    connectDB() {
        (0, database_config_1.dbConnection)();
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)());
        // Set security HTTP headers
        this.app.use((0, helmet_1.default)());
        // Body parser, reading data from body into req.body since FE
        this.app.use(express_1.default.json({ limit: '10kb' })); // limit request as json
        // Recognize object as string o arrays since FE
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' })); // limit request as string and buffer
        // Data sanitization against NoSQL query injection
        this.app.use((0, express_mongo_sanitize_1.default)());
        // Data sanitization against XSS
        this.app.use(xss());
        // Morgan
        if (process.env.NODE_ENV === 'development')
            this.app.use((0, morgan_1.default)("dev"));
    }
    routes() {
        // Dooc with Swagger
        this.app.use(this.urlApi + '/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        // We use PATH_ADMIN to protect routes only to admin
        // TODO: investigate why process.env.PATH_NAME doesn't work in router.ts
        // and obly works in server.config.ts
        this.app.use(`${this.urlApi}${process.env.PATH_ADMIN}/users`, users_router_1.userRouter);
        this.app.use(this.urlApi + "/infopage", infoPage_router_1.infoPageRouter);
        this.app.use(this.urlApi + "/commands", categories_router_1.categoriesRouter);
        this.app.use(this.urlApi + "/filters", filters_router_1.filtersRouter);
        this.app.post(`${this.urlApi}${process.env.PATH_ADMIN}/commands/:id_filter`, auth_1.validateToken, auth_1.controlRoleUser, categories_controller_1.createCommand);
        this.app.patch(`${this.urlApi}${process.env.PATH_ADMIN}/commands/:id_filter/:id_command`, auth_1.validateToken, auth_1.controlRoleUser, categories_controller_1.modificateCommand);
        this.app.delete(`${this.urlApi}${process.env.PATH_ADMIN}/commands/:id_filter/:id_command`, auth_1.validateToken, auth_1.controlRoleUser, categories_controller_1.deleteCommand);
        this.app.post(`${this.urlApi}${process.env.PATH_ADMIN}/filters`, auth_1.validateToken, auth_1.controlRoleUser, filters_controller_1.createFilter);
        this.app.patch(`${this.urlApi}${process.env.PATH_ADMIN}/filters/:id_filter`, auth_1.validateToken, auth_1.controlRoleUser, filters_controller_1.modificateFilter);
        this.app.delete(`${this.urlApi}${process.env.PATH_ADMIN}/filters/:id_filter`, auth_1.validateToken, auth_1.controlRoleUser, filters_controller_1.deleteFilter);
        // CRUD Subcategories
        this.app.use(`${this.urlApi}${process.env.PATH_ADMIN}/subcategories`, auth_1.validateToken, auth_1.controlRoleUser, subCategories_router_1.subCategoriesRouter);
        // Manage any router don't mention before
        this.app.all("*", (req, res, next) => {
            return next(new AppError_1.AppError("Not found route", constants_1.httpCodes.bad_request));
        });
        // Manage errors of Express
        this.app.use(handle_errors_1.globalErrorHandler);
    }
    // Run server
    execute() {
        const server = this.app.listen(process.env.PORT, () => {
            console.log("[server] is listenning on port " + process.env.PORT);
        });
        // Manage error of promises, callbacks, ... that haven't a catch
        // Function which use catchAsync
        process.on("unhandledRejection", (err, origin) => {
            console.log('[UNHANDLED REJECTION] 💥 Shutting down...');
            console.log({
                staus: "error",
                name: err.name,
                message: err.message,
                stack: err.stack,
                origin: origin
            });
            server.close(() => {
                process.exit(1);
            });
        });
        // Close server when we recive a signal SIGTERM
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('💥 Process terminated!');
                process.exit(0);
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.config.js.map