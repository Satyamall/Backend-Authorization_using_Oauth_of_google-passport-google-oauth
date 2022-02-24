
const express = require('express');
const app = express();
const cors= require('cors');

const connect = require("./config/db");
const {signup,signin} = require("./controllers/auth.controller");
const userController = require("./controllers/user.controller");
const passport = require('./config/passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req,res)=>{
    res.send("Home Page Created by Satya Prakash Mall")
})
app.post("/signup", signup);
app.post("/signin", signin);

app.use("/users", userController);

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
      done(err, user);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [
       "https://www.googleapis.com/auth/plus.login",
       "https://www.googleapis.com/auth/userinfo.email"
] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {failureRedirect: '/login'}),
    function(req,res){
        console.log("req",req.user.user, req.user.token)
        // res.redirect('/');
        res.status(201).json({status: "Success", token: req.user.token})
    }
);

const start = async ()=>{
    await connect();

    app.listen(5000,()=>{
        console.log("Listening on port 5000");
    })
}

module.exports = start;