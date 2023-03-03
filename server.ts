import { Server } from "./api/server/server.config";
import dotenv     from 'dotenv';

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
if(process.env.NODE_ENV === 'development'){
    dotenv.config({ path: "./.env.development.local" });
    console.log("[SO] "+process.env.SO);
    console.log("[mode] "+process.env.NODE_ENV);
}else{
    if(process.env.SO !== 'linux'){
        dotenv.config({ path: "./.env.production.local" });
    }
    console.log("[SO] "+process.env.SO);
    console.log("[mode] "+process.env.NODE_ENV);
}

const server = new Server();
server.execute();