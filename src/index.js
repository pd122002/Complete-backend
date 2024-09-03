import dotenv from "dotenv"

import DBconnect from "./db/index.js"
import { app } from "./app.js"
dotenv.config({
    path:'./.env'
})


DBconnect()
.then(()=>{
    app.listen(process.env.PORT || 3000 , ()=>{
        console.log(`server running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed" , err)
})
 