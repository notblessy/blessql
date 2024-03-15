const { createWindow } = require("./main");
const { app, ipcMain } = require("electron");
const { createConnection } = require("./database/sqlite/connection");

require("./database.js.bak");
require("electron-reload")(__dirname);

app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("submit:createConnection", (event, connection) => {
  createConnection(connection);
});
