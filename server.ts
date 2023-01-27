import { Server } from "./api/server/server.config";
import dotenv     from 'dotenv';

// Setup environment
if(process.env.NODE_ENV === 'development'){
    dotenv.config({ path: "./.env.development.local" });
    console.log("[mode] development");
}else{
    if(process.env.SO !== 'linux'){
        dotenv.config({ path: "./.env.production.local" });
    }
    console.log("[mode] production");
}

new Server();