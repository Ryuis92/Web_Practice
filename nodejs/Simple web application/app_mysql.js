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

conn.connect((err)=>{
  if(err){
    console.log(err);
  }
});
const app = express();

app.locals.pretty = true;
app.set("view engine", "jade");
app.set("views", "./views_mysql");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/topic", (req, res) => {
    var title = req.body.title;
    var des = req.body.description;
    var author = req.body.author;
    if(title && des && author){
      var sql = `insert into topic(title, description, author) values("${title}", "${des}", "${author}")`;
      conn.query(sql, (err, rows, fields) =>{
        if(err){
          res.status(500).send("Internal server error");
        }
        else{
            res.redirect("/topic/" + rows.insertId);
        }
      });
    }
});

app.get("/topic/add", (req, res) => {
  var sql = "select title, id from topic;"
  conn.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
    res.render("add", {topics:rows})
  });
});

app.get("/topic/:id/edit", (req, res) =>{
  var id = req.params.id;
  var sql = "select title, id from topic";
  conn.query(sql, (err, rows, fields) =>{
    if(err){
      console.log(err);
      res.status(500).send("Internal server error");
    }
    sql = `select * from topic where id =${id}`;
    conn.query(sql, (err, list, fields) =>{
      if(err){
        console.log(err);
        res.status(500).send("Internal server error");
      }
      res.render("edit", {topics:rows, topic:list[0]});
    });
  });
});

app.post("/topic/:id/edit", (req, res) =>{
  var title = req.body.title;
  var desc = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = `update topic set title = "${title}", description = "${desc}", author = "${author}" where id=${id}`

  conn.query(sql, (err, rows, fields)=>{
    if(err){
      console.log(err);
      res.status(500).send("Internal server error");
    }
    else{
      console.log(rows);
      res.redirect("/topic/" + id);
    }
  });
});

app.get("/topic/:id/delete", (req, res) =>{
  var id = req.params.id;
  var sql = "select title, id from topic";
  conn.query(sql, (err, rows, fields) =>{
    if(err){
      console.log(err);
      res.status(500).send("Internal server error");
    }
    sql = `select * from topic where id =${id}`;
    conn.query(sql, (err, list, fields) =>{
      if(err){
        console.log(err);
        res.status(500).send("Internal server error");
      }
      res.render("delete", {topics:rows, topic:list[0]});
    });
  });
});

app.post("/topic/:id/delete", (req, res) =>{
  var id = req.params.id;
  sql = "delete from topic where id = ?";
  conn.query(sql, [id], (err, rows, fields)=>{
    if(err){
      console.log(err);
      res.status(500).send("Internal server error");
    }
    else{
      res.redirect("/topic");
    }
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

app.listen(8888, () => {
    console.log("Server Connected 8888 port!");
});
