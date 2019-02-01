module.exports = function(){
  const express = require("express");
  const router = express.Router();

  router.get("/", (req, res) =>{
    let displayName;
    console.log(req.user);
    console.log(req.session)
    if(req.user && req.user.displayName){
      displayName = req.user.displayName;
    }

    res.render("home", {displayName: displayName});
  });

  return router;
}
