const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});

const app = express();

app.locals.pretty = true;
app.set("view engine", "jade");
app.set("views", "./views");
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

app.get(["/topic", "/topic/:topic"], (req, res) => {
    fs.readdir("./data", (err, files) => {
        var topic = req.params.topic;
        if (topic) {
            fs.readFile("./data/" + topic, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Internal server error");
                }
                res.render("topic", {files: files, title: topic, content: data});
            })

        } else {
            res.render("topic", {files: files, title: "Hello", content: "Good to see you"});
        }
    })
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