const { app, BrowserWindow } = require("electron");
const { getConnection } = require("./database");
const url = require("url");
const path = require("path");

const createConnection = async (connection) => {
  try {
    const conn = await getConnection();
    const query = "INSERT INTO users (id, name, email) VALUES (?, ?, ?)";
    const res = await conn.query(query, [
      Math.floor(Math.random() * 1000),
      connection.user,
      connection.host,
    ]);

    connection.id = res.insertId;
  } catch (error) {
    console.error(error);
  }
};

const createWindow = async () => {
  const window = new BrowserWindow({
    title: "blessql",
    titleBarStyle: "hidden",
    fullscreenable: false,
    width: 600,
    height: 400,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.webContents.openDevTools();

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "/app/build/index.html"),
  //   protocol: "file",
  // });

  window.loadURL("http://localhost:3000");
  // window.loadURL(startUrl);
};

module.exports = { createWindow, createConnection };
