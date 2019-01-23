const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const mysql = require("mysql");
const conn = mysql.createConnection({
    host: "localhost",
    user: "Ryuis",
    password: "2qldos",
    database: "o2"
});

conn.connect();
const app = express();

app.locals.pretty = true;
app.set("view engine", "jade");
app.set("views", "./views_mysql");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/topic", (req, res) => {
    var title = req.body.title;
    var content = req.body.description;
    fs.writeFile(`./data/${title}`, content, "utf-8", (err) => {
        if (err) {
            console.log(e);
            res.status(500).send("Internal server error");
        }
    res.redirect("/topic/" + title);
        
    });
});


app.get("/topic/new", (req, res) => {
    fs.readdir("./data", (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }
        res.render("new", {files: files, topics: files});
    });
});

app.get(["/topic", "/topic/:id"], (req, res) => {
    var id = req.params.id
    var sql = "select title, id from topic;"
    var title = "Hello";
    var content = "Good to see you";
    conn.query(sql, (err, rows, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal server error");
        }

        if(id){
            sql = `select * from topic where id='${id}';`
            conn.query(sql, (err, list, fields)=>{
                res.render("topic_mysql", {topics: rows, topic:list[0]});
            })
        }
        else
            res.render("topic_mysql", {topics: rows});
    });
});

app.get("/upload", (req, res)=>{
    res.render("upload");
});

app.post('/up', upload.single("first"), function (req, res) {
  res.sendFile("./uploads/" + req.file.filename, {root :"./"} , (err)=>{
      if(err)
            res.status(500).send("internal sever error")
  });
})


app.listen(8888, () => {
    console.log("Server Connected 8888 port!"); 
});