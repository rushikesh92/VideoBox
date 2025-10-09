import express from "express";
import 'dotenv/config'
import connectDB from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 8000;

connectDB()
.then(()=>[
    app.listen(port , ()=>{
    console.log("Server is running on port ", port);
})
])
.catch((err)=>{
    console.log("Database connection failed ", err)
})


//aproach 1  all in one file
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