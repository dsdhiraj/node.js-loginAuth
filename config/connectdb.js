const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/user-auth").then(()=>{
    console.log("Connected to Db")
}).catch((err)=>{
    console.log(`Connection Unsuccessfully error : ${err}`)
})

module.exports = mongoose