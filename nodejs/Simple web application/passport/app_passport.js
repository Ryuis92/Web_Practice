const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

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
      if (users[index].id === username) {
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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  for(var index in users)
    if(id === users[index].id)
      done(null, users[index]);
});

app.get("/", (req, res) =>{
  let nickname;
  console.log(req.user);
  if(req.user && req.user.nickname){
    nickname = req.user.nickname;
  }
  res.render("home", {nickname: nickname});
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
  let id = req.body.username;
  let pw = req.body.password;
  let nickname = req.body.nickname;

  for(var index in users){
    if(users[index].id === id || users[index].nickname === nickname){
      return  res.send("The ID or nickname is already taken.");
    }
  }

  hasher({password: pw}, (err, pass, salt, hash)=>{
    users.push({id:id, nickname:nickname, pw:hash, salt:salt});
    req.login({id:id, nickname:nickname, pw:hash, salt:salt}, (err)=>{
      req.session.save(()=>{
        res.redirect("/");
      });
    });
  });
});

app.listen(port, ()=>{
  console.log("Server is running. port " + port);
});
