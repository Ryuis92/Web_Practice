const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/",(req, res) => {
    res.send("Home Page");
});

app.get("/login",(req, res) => {
    res.send("<h1>Login</h1>");
});

app.listen(3000, () => {
    console.log("Server has started listening 3000 port");
});
