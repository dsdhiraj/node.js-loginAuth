const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const transporter = require("../config/emailConfig");

module.exports={
    userRegistration : async(req,res)=>{
        const {name, email , password , password_confirmation, tc} = req.body
        const user  =await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exists"})
        }else{
            if(name && email && password && password_confirmation && tc){

                    if(password === password_confirmation){
                                try{
                                const salt = await bcrypt.genSalt(10)
                                const hassPassword = await bcrypt.hash(password,salt)
                                const doc = new UserModel({
                                    name:name,
                                    email:email,
                                    password:hassPassword,
                                    tc:tc
                                })
                                
                                await doc.save() 
                                const saved_user = await UserModel.findOne({email:email})
                                const token = jwt.sign({userID:saved_user._id},"dhiraj_key",{expiresIn :'5d'})
                                res.send({"status":"Success","message":"Registation Successfully","token":token})
                            }catch(error){
                                console.log(error);
                            }

                    }else{
                        res.send({"status":"failed","message":"Passwords Does not Match"})
                    }

            }else{
                res.send({"status":"failed","message":"All fields are require"})
            }
        }
    },

    userLogin:async(req,res)=>{
        try{
            const {email,password} = req.body
            if(email && password){
            const user = await UserModel.findOne({email:email})
                    if(user != null){
                            const isMatch = await bcrypt.compare(password,user.password)
                            if((user.email === email) && isMatch){

                                const token = jwt.sign({userID:user._id},"dhiraj_key",{expiresIn :'5d'})

                                res.send({"status":"Success","message":"Login Successfully","token":token})
                            }else{
                                res.send({"status":"failed","message":"Email or Password don't valid"})
                            }
                    
                    }else{
                        res.send({"status":"failed","message":"You are not Register User"})
                    }
            }else{
                res.send({"status":"failed","message":"AllFields are Require"})
            }
        }catch(error){
            console.log(error)
            res.send({"status":"failed","message":"Unable to Login"})

        }

    },
    changePassword:async(req,res)=>{
        const {password,password_confirmation} = req.body
        if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({"status":"failed","message":"new Password and Confirm New password does not match"})
                }else{
                    const salt = await bcrypt.genSalt(10)
                        const newHashPassword = await  bcrypt.hash(password,salt)

                        await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newHashPassword}})
 
                        res.send({"status":"Success","message":"Password Changed Successfully"})
                }
        }else{
            res.send({"status":"failed","message":"All Fields are Require"})
        }
    }
    ,
    sendUserPasswordResetEmail:async(req,res)=>{

                const {email}=req.body    
                if(email){

                   const user = await UserModel.findOne({email:email})
                   if(user){
                       const secret = user._id + "dhiraj_key"         
                            const token = jwt.sign({userID:user._id},secret,{expiresIn:"15m"})

                            const link = `http://localhost:5000/api/user/reset/${user._id}/${token}}`

                                // let info = await transporter.sendMail({
                                //     from:"dhirajsonawane4720@gmail.com",
                                //     to:user.email,
                                //     subject:"Dhiraj Learning Password Reset",
                                //     html:`<a href=${link}>Click Here </a> to reset your password`
                                // })

                                // res.send({"status":"Success","message":"Password Reser EmailSend Please Check Your Email","info":info})
                                
                                // console.log(link)
                                res.send({"status":"Success","message":"Password Reser EmailSend Please Check Your Email","usrl":link})

                            }else{
                                res.send({"status":"failed","message":"Email does not exists"})

                            }

                }else{
                       
                    res.send({"status":"failed","message":"Email Fields is Require"})

                }

    },
    userPasswordReset:async(req,res)=>{
        const {password,password_confirmation}=req.body

        const {id,token}=req.params

        const user = await UserModel.findById(id)

        const new_secret = user._id + "dhiraj_key"
        try{
            jwt.verify(token , new_secret)
                if(password && password_confirmation){
                        if(password !== password_confirmation){
                            res.send({"status":"failed","message":"New password and confirm new password does not match"})
                        }else{
                            const salt = await bcrypt.genSalt(10)
                            const newHashPassword = await  bcrypt.hash(password,salt)
                        await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashPassword}})
                        res.send({"status":"Success","message":"Password Changed Successfully"})


                        }
                }else{
                    res.send({"status":"failed","message":"All Fields are Require"})

                }


        }catch(error){
            throw error
        }
    }


}