
const express = require("express");
const router = express.Router();

const User = require('../models/user.model');

const protect = require("../middlewares/protect");
const authorization = require("../middlewares/authorization");

const {editor,admin} = require("../utils/constants");

router.get("/", protect, authorization([editor,admin]),async (req,res)=>{

    const users = await User.find({}).select("-password").lean().exec();

    return res.status(200).json({data: users})
})

module.exports = router;