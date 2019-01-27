const myrouter = require("./route_cookie")

function start(handlers)
{
  const express = require("express");
  const cookieParser = require("cookie-parser");
  const app = express();
  app.use(cookieParser("asdadjgasjdfj!@#545"));
  let port = 8888;
  myrouter.myroute(app, handlers);

  app.listen(port , ()=>{
    console.log("Sever running port: " + port);
  });
}

exports.start = start;
