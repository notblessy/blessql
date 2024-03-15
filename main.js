const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = async () => {
  const window = new BrowserWindow({
    title: "blessql",
    titleBarStyle: "hidden",
    fullscreenable: false,
    width: 600,
    height: 400,
    // resizable: false,
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

module.exports = { createWindow };
