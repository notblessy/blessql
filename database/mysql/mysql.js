let mysql = require("mysql");

const testConnection = (data) => {
  const connection = mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
    database: data.database,
    port: data.port,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(connection);
    });
  });
};

module.exports = { testConnection };
