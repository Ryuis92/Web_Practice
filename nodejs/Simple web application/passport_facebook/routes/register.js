module.exports = function(hasher, users){
  const express = require("express");
  const router = express.Router();

  router.get("/", (req, res)=>{
    res.render("register");
  });

  router.post("/", (req,res)=>{
    let id = "local:" + req.body.username;
    let name = req.body.username;
    let pw = req.body.password;
    let displayName = req.body.displayName;

    for(var index in users){
      if(users[index].name === name || users[index].displayName === displayName){
        return  res.send("The ID or displayName is already taken.");
      }
    }

    hasher({password: pw}, (err, pass, salt, hash)=>{
      users.push({id:id, name:name, displayName:displayName, pw:hash, salt:salt});
      req.login(users[users.length-1], (err)=>{
        req.session.save(()=>{
          res.redirect("/");
        });
      });
    });
  });

  return router;
}
