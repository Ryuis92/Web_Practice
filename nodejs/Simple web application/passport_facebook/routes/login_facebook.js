module.exports = function(passport){
  const express = require("express");
  const router = express.Router();

  router.get("/", passport.authenticate('facebook'));
  router.get("/callback", passport.authenticate('facebook', { successRedirect: '/',
                                                                       failureRedirect: '/auth/login' })
  );

  return router;
};
