const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = async () => {
  const window = new BrowserWindow({
    name: "connection-list",
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

  // window.webContents.openDevTools();

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "/app/build/index.html"),
  //   protocol: "file",
  // });

  window.loadURL("http://localhost:3000");
  // window.loadURL(startUrl);
};

const createDashboardWindow = async (sender) => {
  const window = BrowserWindow.fromWebContents(sender);

  const dashboardWindow = new BrowserWindow({
    parent: window,
    title: "blessql-dashboard",
    titleBarStyle: "hidden",
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });

  // TODO: should change path to build
  dashboardWindow.loadURL("http://localhost:3000/dashboard");

  dashboardWindow.once("ready-to-show", () => {
    dashboardWindow.show();
  });
};

module.exports = { createWindow, createDashboardWindow };
