module.exports = function(app){
  const passport = require("passport");
  const LocalStrategy = require('passport-local').Strategy;
  const FacebookStrategy = require('passport-facebook').Strategy;
  const hasher = require("pbkdf2-password")();
  const conn = require("./db")();
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    function(username, password, done) {
      let sql = "select * from users where authId = ?"
      conn.query(sql, ["local:"+username], (err, rows, fields)=>{
        if (rows === undefined)
          return done(null, false);

        return hasher({password:password, salt:rows[0].salt}, (err, pass, salt, hash)=>{
          if(rows[0].password === hash){
            done(null, rows[0]);
          }
          else{
            done(null, false);
          }
        });
      })
    }
  ));

  passport.use(new FacebookStrategy({
      clientID: "ID",
      clientSecret: "secret",
      callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      let sql = "select * from users where authId = ?"
      conn.query(sql, "facebook:"+profile.id, (err, rows, fields) =>{
        if(rows[0].id === "facebook:"+profile.id)
          return done(null, rows[0]);
        else {
          user = {id: "facebook:"+profile.id, displayName:profile.displayName};
          sql = "insert into users(authId, displayName) values(?)"
          conn.query(sql ,[user.id, user.displayName], (err, rows, fields)=>{
            done(null, user);
          })
        }
      })
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.authId);
  });

  passport.deserializeUser(function(id, done) {
    let sql = "select * from users where authId = ?"
    conn.query(sql, [id], (err, rows, fields)=>{
      if(id === rows[0].authId)
        done(null, rows[0]);
    })
  });

  return passport;
}
