const { createWindow, createDashboardWindow } = require("./main");
const { app, ipcMain, BrowserWindow, dialog } = require("electron");
const { createConnection } = require("./database/sqlite/connection");
const { db: sqlite } = require("./database/sqlite/sqlite");

let mysql;

const path = require("path");
const { mysqlConnect } = require("./database/mysql/mysql");

require("./database.js.bak");
require("electron-reload")(__dirname);

app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("before-quit", () => {
  if (sqlite) {
    sqlite.close();
  }
});

ipcMain.on("submit:createConnection", async (event, connection) => {
  await createConnection(connection);

  const windows = BrowserWindow.getAllWindows();
  windows.forEach((window) => {
    window.reload();
  });

  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

ipcMain.on("window:createConnection", (event, data) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  const windowAddConnection = new BrowserWindow({
    parent: window,
    title: "blessql",
    titleBarStyle: "hidden",
    fullscreenable: false,
    width: 300,
    height: 300,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });

  // TODO: should change path to build
  windowAddConnection.loadURL("http://localhost:3000/create-connection");

  windowAddConnection.once("ready-to-show", () => {
    windowAddConnection.show();
  });
});

ipcMain.on("test-connection", async (event, data) => {
  try {
    const connection = await mysqlConnect(data);

    if (connection && connection.state === "authenticated") {
      await connection.query("SELECT * FROM users", (err, rows) => {
        if (err) {
          throw new Error(err);
        }

        event.sender.send("test-connection-result", {
          status: "success",
        });
      });
    }

    connection.end();
  } catch (error) {
    switch (error.code) {
      case "ENOTFOUND":
        dialog.showErrorBox("Error", "No such host");
      case "ECONNREFUSED":
        dialog.showErrorBox("Error", "Connection refused");
      default:
        dialog.showErrorBox("Error", error.sqlMessage);
    }

    event.sender.send("test-connection-result", {
      status: "error",
    });
  }
});

ipcMain.on("mysql:connect", async (event, data) => {
  try {
    mysql = await mysqlConnect(data);

    if (mysql && mysql.state === "authenticated") {
      const window = BrowserWindow.fromWebContents(event.sender);

      const dashboardWindow = new BrowserWindow({
        title: "blessql-dashboard",
        titleBarStyle: "hidden",
        width: 1000,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          preload: path.join(__dirname, "preload.js"),
        },
        show: false,
      });

      dashboardWindow.webContents.openDevTools();

      // TODO: should change path to build
      dashboardWindow.loadURL("http://localhost:3000/dashboard");

      dashboardWindow.once("ready-to-show", () => {
        dashboardWindow.show();
        dashboardWindow.webContents.send("mysql-session", {
          host: mysql.config.host,
          user: mysql.config.user,
          database: mysql.config.database,
          port: mysql.config.port,
        });

        window.close();
      });

      dashboardWindow.on("close", async () => {
        await mysql.end();
        await createWindow();
      });
    }
  } catch (error) {
    switch (error.code) {
      case "ENOTFOUND":
        dialog.showErrorBox("Error", "No such host");
      case "ECONNREFUSED":
        dialog.showErrorBox("Error", "Connection refused");
      default:
        dialog.showErrorBox("Error", error.sqlMessage);
    }

    event.sender.send("mysql:connect-result", {
      status: "error",
    });
  }
});
