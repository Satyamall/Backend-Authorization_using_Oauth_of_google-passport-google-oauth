
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require("dotenv").config();

const newToken = (user) => {
    return jwt.sign({ id: user._id},process.env.JWT_SECRET_KEY);
}

const signup = async (req,res)=>{
    try{
        const user = await User.create(req.body);
        const token = newToken(user);
        return res.status(201).json({data: {token}});
    }
    catch(err){
        return res.status(500).json({ status: "failed", message: "Something went wrong!"});
    }
}


const signin = async (req,res)=>{
    // we will find the user with the email address
    let user;
    try{

        user = await User.findOne({ email: req.body.email});

        if(!user) return res.status(401).json({
            status: "failed",
            message: "Your email or password is not correct"
            })
    }
    catch(err){
        return res.status(500).json({ status: "failed", message: "Something went wrong!"});
    }
    
    try{
        // we will try to match the password the user has with the password stored in the system
        const match = await user.checkPassword(req.body.password);

        if(!match)
           return res.status(401).json({
               status: "failed",
               message: "your email or password is not correct"
           })
    }
    catch(err){
        return res.status(500).json({ status: "failed", message: "Something went wrong!"});
    }

    // create a new token and return it
    const token = newToken(user);

    return res.status(201).json({data: {token}});
}

module.exports = {
    signup,
    signin,
    newToken
}