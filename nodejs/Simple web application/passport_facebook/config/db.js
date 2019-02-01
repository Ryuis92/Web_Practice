module.exports = function(){
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
  return conn;
}
