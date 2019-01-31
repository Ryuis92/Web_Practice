module.exports = function(passport){
  const express = require("express");
  const router = express.Router();

  router.get("/", (req, res)=>{
    res.render("login");
  });

  router.post("/", passport.authenticate('local', { successRedirect: '/',
                                                          failureRedirect: '/auth/login',
                                                          failureFlash: false })
  );
  return router;
};
