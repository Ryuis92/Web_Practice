const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
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

app.set("view engine", "jade");
app.set("views", "./view");

app.get("/", (req, res) =>{
  var nickname;
  console.log(users);
  if(req.session.nickname){
    nickname = req.session.nickname;
  }
  res.render("home", {nickname: nickname});
});

app.get("/auth/login", (req, res)=>{
  res.render("login");
});

app.post("/auth/login", (req, res) => {
  let id = req.body.id;
  let pw = req.body.pw;

  for (var index in users) {
    if (users[index].id === id) {
      return hasher({password:pw, salt:users[index].salt}, (err, pass, salt, hash)=>{
        if(users[index].pw === hash){
          req.session.nickname = users[index].nickname;
          req.session.save(()=>{
            res.redirect("/");
          })
        }
      });
    }
  }
  res.send("Not matching Username and Password");
});

app.get("/auth/logout", (req, res)=>{
  delete req.session.nickname;
  res.redirect("/");
})

app.get("/auth/register", (req, res)=>{
  res.render("register");
});

app.post("/auth/register", (req,res)=>{
  let id = req.body.id;
  let pw = req.body.pw;
  let nickname = req.body.nickname;


  for(var index in users){
    if(users[index].id === id || users[index].nickname === nickname){
      return  res.send("The ID or nickname is already taken.");
    }
  }

  req.session.nickname = nickname;
  hasher({password: pw}, (err, pass, salt, hash)=>{
    users.push({id:id, nickname:nickname, pw:hash, salt:salt});
    res.redirect("/");
  });
});

app.listen(port, ()=>{
  console.log("Server is running. port " + port);
});
