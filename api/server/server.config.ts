import express from 'express';
import { dbConnection } from '../database/database.config';
import { categoriesRouter } from '../categories/categories.router';
import { filtersRouter } from '../filters/filters.router';
import { userRouter } from '../users/users.router';

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
        // Body parser, reading data from body into req.body since FE
        this.app.use(express.json({ limit: '1kb' }));          // limit request as json
    }
            
    routes(){
        this.app.use(this.urlApi + "/users", userRouter);
        this.app.use(this.urlApi + "/filters", filtersRouter);
        this.app.use(this.urlApi + "/commands", categoriesRouter);
        
        this.app.all("*", (req, res) => {
            return res.json({
                msg: "Not found route"
            });
        });
    }

    // Run server
    execute(){
        this.app.listen(process.env.PORT, () => {
            console.log("[server] is listenning on port " + process.env.PORT);
        });
    }
}