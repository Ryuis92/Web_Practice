module.exports = function(hasher, users){
  const express = require("express");
  const router = express.Router();
  const conn = require("../config/db")();
  router.get("/", (req, res)=>{
    res.render("register");
  });

  router.post("/", (req,res)=>{
    let id = "local:" + req.body.username;
    let name = req.body.username;
    let pw = req.body.password;
    let displayName = req.body.displayName;
    let sql = `select * from users where username = "${name}" or displayName = "${displayName}"`
    conn.query(sql, (err, rows, fields)=>{
      if (rows.length > 0)
        return  res.send("The ID or displayName is already taken.");
      hasher({password: pw}, (err, pass, salt, hash)=>{
        user = {authId:id, username:name, displayName:displayName, password:hash, salt:salt};
        sql = `insert into users(authId, username, displayName, password, salt) values("${id}", "${name}","${displayName}","${hash}","${salt}")`
        conn.query(sql, (err, rows, fields)=>{
          req.login(user, (err)=>{
            req.session.save(()=>{
              res.redirect("/");
            });
          });
        })
      });
    })
  });

  return router;
}
