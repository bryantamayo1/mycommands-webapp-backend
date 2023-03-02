import mongoose from "mongoose";

/**
 * Connect to MongoDB
 */
export const dbConnection = async() => {
    try{
        let dataBase = process.env.DATABASE || "";
        
        if(process.env.NODE_ENV === "production"){
            dataBase = dataBase.replace("<PASSWORD>", process.env.DATABASE_PASSWORD!);
        }

        // Disable warning in mongoose version 8
        mongoose.set("strictQuery", true);
        //@ts-ignore
        await mongoose.connect(dataBase, {
            auth: {
                authSource: "admin"
            },
            user:  process.env.USER,
            pass: process.env.PASS
        });
        console.log("[bbdd] online");
    }catch(error){
        console.log("[error bbdd connect] ", error);
        console.log("[bbdd] offline");
    }
}