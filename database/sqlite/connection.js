var sqlite = require("./sqlite");
var db = sqlite.db;

const getConnection = () => {
  const stmt = db.prepare("SELECT * FROM connections");
  return stmt.all();
};

const createConnection = async (connection) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
module.exports = { getConnection };
