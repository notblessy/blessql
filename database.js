let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "keep_service",
});

const getConnection = () => {
  console.log("KONEKSI", connection)
  return connection;
};

module.exports = { getConnection };
