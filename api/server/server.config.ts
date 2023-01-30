import express from 'express';
import { dbConnection } from '../database/database.config';
import { categoriesRouter } from '../categories/categories.router';
import { findFilters } from '../categories/categories.controller';

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
    }

    connectDB(){
        dbConnection();
    }

    middlewares(){
        this.app.use(this.urlApi + "/filters", findFilters);
        this.app.use(this.urlApi + "/commands", categoriesRouter);
    }

    // Run server
    execute(){
        this.app.listen(process.env.PORT, () => {
            console.log("[server] is listenning on port " + process.env.PORT);
        });
    }
}