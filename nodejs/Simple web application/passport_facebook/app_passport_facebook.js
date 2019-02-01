const app = require("./config/express")();
const hasher = require("pbkdf2-password")();
const passport = require("./config/passport")(app);
let port = 8888;


const login_local = require("./routes/login_local")(passport);
const login_facebook = require("./routes/login_facebook")(passport);
const logout = require("./routes/logout")();
const register = require("./routes/register")(hasher);
const home = require("./routes/home")();

app.use("/auth/facebook", login_facebook);
app.use("/auth/login", login_local);
app.use("/auth/logout", logout);
app.use("/auth/register", register);
app.use("/", home);

app.listen(port, ()=>{
  console.log("Server is running. port " + port);
});
