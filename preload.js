const { contextBridge, ipcRenderer } = require("electron");
const { getAllConnections } = require("./database/sqlite/connection");
const { getMysqlSession } = require("./database/mysql/mysql");

contextBridge.exposeInMainWorld("blessql", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  getAllConnections: async () => {
    return await getAllConnections();
  },
});
