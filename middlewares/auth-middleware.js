const jwt = require("jsonwebtoken")
const  UserModel = require("../models/user")

var checkUserAuth = async(req, res ,next )=>{
    let token
    const {authorization} = req.headers
    if(authorization && authorization.startsWith("Bearer")){
        try{
                token = authorization.split(' ')[1]

                const {userID} = jwt.verify(token ,"dhiraj_key")

                req.user = await UserModel.findById(userID).select("--password")
                next()
        }catch(error){
            res.send({"status":"failed","message":"Unauthorized User"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorized User , No token Found"})
    }
}


module.exports =checkUserAuth