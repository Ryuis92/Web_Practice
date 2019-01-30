const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
let port = 8888;
let users = [];

app.locals.pretty = true;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "jade");
app.set("views", "./view");

passport.use(new LocalStrategy(
  function(username, password, done) {
    for (var index in users) {
      if (users[index].id === "local:"+username) {
        return hasher({password:password, salt:users[index].salt}, (err, pass, salt, hash)=>{
          if(users[index].pw === hash){
            done(null, users[index]);
          }
          else{
            done(null, false);
          }
        });
      }
    }
    done(null, false);
  }
));

passport.use(new FacebookStrategy({
    clientID: "ID",
    clientSecret: "secret",
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    for(var index in users)
    {
      if(users[index].id === "facebook:"+profile.id)
        return done(null, users[index]);
    }
    user = {id: "facebook:"+profile.id, displayName:profile.displayName};
    done(null, user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  for(var index in users)
    if(id === users[index].id)
      done(null, users[index]);
});

app.get("/auth/facebook", passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/',
                                                                      failureRedirect: '/auth/login' })
);

app.get("/", (req, res) =>{
  let displayName;
  console.log(req.user);
  console.log(req.session)
  if(req.user && req.user.displayName){
    displayName = req.user.displayName;
  }
  res.render("home", {displayName: displayName});
});

app.get("/auth/login", (req, res)=>{
  res.render("login");
});

app.post('/auth/login', passport.authenticate('local', { successRedirect: '/',
                                                        failureRedirect: '/auth/login',
                                                        failureFlash: false })
);

app.get("/auth/logout", (req, res)=>{
  req.logout();
  req.session.save(()=>{
    res.redirect("/");
  });
});

app.get("/auth/register", (req, res)=>{
  res.render("register");
});

app.post("/auth/register", (req,res)=>{
  let id = "local:" + req.body.username;
  let name = req.body.username;
  let pw = req.body.password;
  let displayName = req.body.displayName;

  for(var index in users){
    if(users[index].name === name || users[index].displayName === displayName){
      return  res.send("The ID or displayName is already taken.");
    }
  }

  hasher({password: pw}, (err, pass, salt, hash)=>{
    users.push({id:id, name:name, displayName:displayName, pw:hash, salt:salt});
    req.login(users[users.length-1], (err)=>{
      req.session.save(()=>{
        res.redirect("/");
      });
    });
  });
});

app.listen(port, ()=>{
  console.log("Server is running. port " + port);
});
