const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./temp.db");

db.serialize(() => {
  const query = `
    CREATE TABLE IF NOT EXISTS connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host TEXT NOT NULL,
        user TEXT NOT NULL,
        password TEXT NOT NULL,
        port INTEGER NOT NULL,
        database TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='connections'`,
    (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }

      if (!row) {
        db.run(query);
        console.log("Table created successfully!");
      }
    }
  );

  let rows = [];

  db.get(`SELECT * FROM connections`, (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    rows.push(row);
  });
});

module.exports = { db };
