import express from 'express';
import { dbConnection } from '../database/database.config';
import { categoriesRouter } from '../categories/categories.router';

export class Server{
    app;
    urlApi = "v1/"
    constructor(){
        // Server
        this.app = express();

        // Connect DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Run server
        this.execute();

    }

    connectDB(){
        dbConnection();
    }

    middlewares(){
        this.app.use(this.urlApi + "/filters", categoriesRouter);
    }

    execute(){
        this.app.listen(process.env.PORT, () => {
            console.log("[server] is listenning on port " + process.env.PORT);
        });
    }
}