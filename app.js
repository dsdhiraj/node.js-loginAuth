const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors")              

const app = express();;
const port = process.env.PORT || 3000
const userRegistationRoutes = require("./routes/userRoutes")
require("./config/connectdb")

app.use(cors())
app.use(express.json());
app.use("/api/user",userRegistationRoutes)



app.listen(port,()=>{
    console.log(`Server Listening at Port : ${port}`)
})