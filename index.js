const { createWindow, createConnection } = require("./main");
const { app, ipcMain } = require("electron");

require("./database");
require("electron-reload")(__dirname);

app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("submit:createConnection", (event, connection) => {
  createConnection(connection);
});
