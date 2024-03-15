var sqlite = require("./sqlite");
var db = sqlite.db;

const getAllConnections = async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM connections";

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
};

const createConnection = async (connection) => {
  try {
    db.serialize(async () => {
      const query =
        "INSERT INTO connections (user, host, password, database, port) VALUES (?, ?, ?, ?, ?)";

      const stmt = db.prepare(query);
      stmt.run(
        connection.user,
        connection.host,
        connection.password,
        connection.database,
        connection.port
      );

      stmt.finalize();
    });

    db.close();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getAllConnections, createConnection };
