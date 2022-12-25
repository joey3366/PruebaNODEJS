const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    database: "pruebadb",
    password: "", 
  })
  .on("error", (err) => {
    console.log("Error de conexion a la base de datos - ", err);
});

module.exports = db_connection;