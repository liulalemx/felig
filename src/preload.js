const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sim_check: (filesList) => ipcRenderer.invoke("sim_check", filesList),
});
