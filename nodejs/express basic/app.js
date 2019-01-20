const express = require("express");
const app = express();

app.set("view engine" , "jade");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/topic/:id", (req, res) =>{
  res.send(req.params);
});

app.get("/",(req, res) => {
    res.render("first", {time: Date()});
});

app.get("/login",(req, res) => {
    res.send("<h1>Login</h1>");
});

app.listen(3000, () => {
    console.log("Server has started listening 3000 port");
});
