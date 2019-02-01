module.exports = function(){
  const express = require("express");
  const session = require("express-session");
  const bodyParser = require("body-parser");

  const app = express();

  app.locals.pretty = true;

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  app.use(bodyParser.urlencoded({extended: true}));
  app.set("view engine", "jade");
  app.set("views", "./view");

  return app;
}
