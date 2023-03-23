const express = require("express");
const userController = require("../controllers/userController");
const routes = express.Router();
const userControllers = require("../controllers/userController.js");
const checkUserAuth = require("../middlewares/auth-middleware");

routes.use("/changepassword",checkUserAuth)


routes.post("/register",userControllers.userRegistration)
routes.post("/login",userControllers.userLogin)
routes.post("/send-reset-password-email",userControllers.sendUserPasswordResetEmail)
routes.post("/reset-password/:id/:token",userControllers.userPasswordReset)





routes.post("/changepassword",userControllers.changePassword)

module.exports = routes