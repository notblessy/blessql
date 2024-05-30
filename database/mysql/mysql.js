let mysql = require("mysql");

let connection;

const mysqlConnect = (data) => {
  conn = mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
    database: data.database,
    port: data.port,
  });

  connection = new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(conn);
    });
  });
};

const getMysqlConnection = async () => {
  const conn = await connection;
  return conn;
};

const getMysqlSession = async () => {
  try {
    const conn = await connection;

    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT CONCAT('MySQL Version ', SUBSTRING_INDEX(VERSION(), '-', 1)) AS version, SUBSTRING_INDEX(USER(), '@', 1) AS 'user', SUBSTRING_INDEX(USER(), '@', -1) AS 'host', @@port AS 'port', DATABASE() AS 'database';`,
        (err, rows, fields) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows);
        }
      );
    });
  } catch (error) {
    dialog.showErrorBox("Error", error.message);
  }
};

const getTables = async ({ database }) => {
  try {
    const conn = await connection;

    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT table_name as table_name FROM information_schema.tables WHERE table_schema = '${database}';`,
        (err, rows, fields) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(rows);
        }
      );
    });
  } catch (error) {
    dialog.showErrorBox("Error", error.message);
  }
};

const getTableRows = async ({ table, filter }) => {
  try {
    const conn = await connection;

    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM ${table} LIMIT 25;`, (err, rows, fields) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
  } catch (error) {
    dialog.showErrorBox("Error", error.message);
  }
};

module.exports = {
  mysqlConnect,
  getMysqlConnection,
  getMysqlSession,
  getTables,
  getTableRows,
};
