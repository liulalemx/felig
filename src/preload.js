const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sim_check: (filesList, query) =>
    ipcRenderer.invoke("sim_check", filesList, query),
  open_file: (filesPath) => ipcRenderer.invoke("open_file", filesPath),
});
