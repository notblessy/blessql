const { contextBridge, ipcRenderer } = require("electron");
const os = require("os");

contextBridge.exposeInMainWorld("electron", {
  homeDir: os.homedir(),
  os: {
    hostname: os.hostname(),
    platform: os.platform(),
  },
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
  },
  // getConnection: () => {
  //   return getConnection();
  // },
  // createConnection: (connection) => {
  //   return createConnection(connection);
  // },
  // createWindow: () => {
  //   return createWindow();
  // },
});

contextBridge.exposeInMainWorld("blessql", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});
