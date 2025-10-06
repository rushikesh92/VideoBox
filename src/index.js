import express from "express";
import 'dotenv/config'
import connectDB from "./db/index.js";

connectDB();


//aproach 1 
/*
const app = express();

(async ()=>{
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        app.on("error" ,(error)=>{
             console.error("ERROR : " + error);
            throw error;
        } )

        app.listen( process.env.PORT, ()=>{
            console.log(`App is listening to port `+ process.env.PORT);
        })


    } catch (error) {
        console.error("ERROR : " + error);
        throw error;
    }
})()
*/