require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const port = process.env.PORT || 3001;
var userProfile;


const app = express();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({
  extended: true
}));

mongoose.connect('mongodb+srv://rakshitgondwal:chitkararakshit@cluster0.wofkim8.mongodb.net/affixity',{
  useNewUrlParser : true
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  name : String,
  email : String,
  password : String,
  gradyear : String,
  techStacks : String,
  github : String,
  linkedIn : String,
  twitter : String
});


const User = mongoose.model("User", userSchema);

app.post("/signup", function(req,res){
  const user = new User({
    name : req.body.name,
    email : req.body.email,
    gradyear : req.body.gradyear,
    password : req.body.password
  });
  
  user.save();
});






app.get("/", function(req,res){
  res.sendFile(__dirname + "/pages/landing/index.html")
});


app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                         //GET FUNCTIONS//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/signup", function(req,res){
    res.sendFile(__dirname + '/pages/signup.html');
} );

app.get("/landing",function(req,res){
    res.sendFile(__dirname + "/pages/landing/index.html")
});

app.get("/lists",function(req,res){
    res.sendFile(__dirname + "/pages/lists.html")
});

app.get("/myprofile",function(req,res){
  res.sendFile(__dirname + "/pages/myprofile.html")
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                         //POST FUNCTIONS//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signin", function(req,res){
    User.find({},function(err,users){
      if(err){
        console.log(err);
      }else{
        for(var i = 0; i<users.length; i++){
          if(users[i].email == req.body.signInEmail && users[i].passowrd == req.body.signInPass){
            res.redirect("/landing");
          }else{
            res.send("User not found. Please signup.");
          }
        }
      }
    })
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });