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

        // Body parser, reading data from body into req.body since FE
        this.app.use(express.json({ limit: '1kb' }));          // limit request as json

        // Recognize object as string o arrays since FE
        this.app.use(express.urlencoded({ extended: true, limit: '1kb' })); // limit request as string and buffer

        // Morgan
        if(process.env.NODE_ENV === 'development') this.app.use(morgan("dev"));
    }
            
    routes(){
        this.app.use(this.urlApi + "/users", userRouter);
        this.app.use(this.urlApi + "/filters", filtersRouter);
        this.app.use(this.urlApi + "/commands", categoriesRouter);
        
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