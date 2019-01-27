const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
let port = 8888;
let list = {"Insoo" : "123"};

app.locals.pretty = true;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "jade");
app.set("views", "./view");

app.get("/", (req, res) =>{
  var username;
  if(req.session.username)
  {
    username = req.session.username;
  }
  res.render("home", {id: username});
});

app.get("/auth/login", (req, res)=>{
  res.render("login");
});

app.post("/auth/login", (req, res) =>{
  let id = req.body.id;
  let pw = req.body.pw;

  for(var key in list)
  {
    if(key === id && list[key] === pw)
    {
      req.session.username = id;
      break;
    }
  }
  if(req.session.username)
    res.redirect("/");
  else
    res.send("Not matching Username and Password");
});

app.get("/auth/logout", (req, res)=>{
  delete req.session.username;
  res.redirect("/");
})

app.listen(port, ()=>{
  console.log("Server is running. port " + port);
});
