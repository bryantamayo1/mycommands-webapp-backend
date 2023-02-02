import express, { NextFunction } from 'express';
import { dbConnection } from '../database/database.config';
import { categoriesRouter } from '../categories/categories.router';
import { filtersRouter } from '../filters/filters.router';
import { userRouter } from '../users/users.router';
import { httpCodes } from '../utils/constants';
import { globalErrorHandler } from '../manage-errors/handle-errors';
import morgan from 'morgan';
import cors from 'cors';
import { AppError } from '../manage-errors/AppError';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import { validateToken } from '../auth/auth';
import { createFilter, modificateFilter } from '../filters/filters.controller';
import { createCommand } from '../categories/categories.controller';
const xss = require('xss-clean');


export class Server{
    app;
    urlApi = "/v1"
    constructor(){
        // Server
        this.app = express();

        // Connect DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    connectDB(){
        dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());
        
        // Set security HTTP headers
        this.app.use(helmet());

        // Body parser, reading data from body into req.body since FE
        this.app.use(express.json({ limit: '1kb' }));          // limit request as json

        // Recognize object as string o arrays since FE
        this.app.use(express.urlencoded({ extended: true, limit: '1kb' })); // limit request as string and buffer

        // Data sanitization against NoSQL query injection
        this.app.use(ExpressMongoSanitize());

        // Data sanitization against XSS
        this.app.use(xss());

        // Morgan
        if(process.env.NODE_ENV === 'development') this.app.use(morgan("dev"));
    }
            
    routes(){
        // We use PATH_ADMIN to protect routes only to admin
        // TODO: investigate why process.env.PATH_NAME doesn't work in router.ts
        // and obly works in server.config.ts
        this.app.use(`${this.urlApi}${process.env.PATH_ADMIN}/users`, userRouter);
        
        this.app.use(this.urlApi + "/commands", categoriesRouter);
        this.app.use(this.urlApi + "/filters", filtersRouter);

        this.app.post(`${this.urlApi}${process.env.PATH_ADMIN}/commands/:id_filter`, validateToken, createCommand);
        this.app.post(`${this.urlApi}${process.env.PATH_ADMIN}/filters`, validateToken, createFilter);
        this.app.patch(`${this.urlApi}${process.env.PATH_ADMIN}/filters/:id_filter`, validateToken, modificateFilter);
        
        // Manage any router don't mention before
        this.app.all("*", (req, res, next: NextFunction) => {
            return next(new AppError("Not found route", httpCodes.bad_request));
        });

        // Manage errors of Express
        this.app.use(globalErrorHandler);
    }

    // Run server
    execute(){
        const server = this.app.listen(process.env.PORT, () => {
            console.log("[server] is listenning on port " + process.env.PORT);
        });
        
        // Manage error of promises, callbacks, ... that haven't a catch
        process.on("unhandledRejection", (err: any, origin) => {
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