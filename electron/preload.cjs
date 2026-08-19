const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("crosshairDesktop", {
  copyText: (value) => ipcRenderer.invoke("clipboard:write", value),
  getAppInfo: () => ipcRenderer.invoke("app:info"),
  showDataFolder: () => ipcRenderer.invoke("shell:show-data")
});

