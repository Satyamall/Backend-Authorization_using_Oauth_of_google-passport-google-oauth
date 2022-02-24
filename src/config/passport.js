
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy;
require('dotenv').config();

const User = require('../models/user.model');
const {newToken} = require('../controllers/auth.controller');

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  },
  async function(accessToken, refreshToken, profile, done) {

    // first check if user with given email exists
    let user = await User.findOne({email: profile?._json?.email});
    
    if(!user){
      // else create the user and then create the token
      user = await User.create({email: profile?._json?.email})
    }
    
    // if yes then create the token for this user
    const token = newToken(user)
    console.log("token",token);
    return done(null, {user, token});
  }
));

module.exports = passport;