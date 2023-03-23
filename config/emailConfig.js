const dotenv = require("dotenv")
dotenv.config()

const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure:false,
    auth:{
        user:"dhirajsonawane4720@gmail.com",
        pass:"*********"
    }
})

module.exports = transporter