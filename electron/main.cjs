const { app, BrowserWindow, clipboard, ipcMain, session, shell } = require("electron");
const path = require("path");

const isPortable = Boolean(process.env.PORTABLE_EXECUTABLE_DIR);

if (isPortable) {
  app.setPath("userData", path.join(process.env.PORTABLE_EXECUTABLE_DIR, "准星匣-data"));
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1080,
    minHeight: 700,
    show: false,
    backgroundColor: "#090d14",
    icon: path.join(__dirname, "..", "assets", "icon.ico"),
    title: "准星匣",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged
    }
  });

  window.loadFile(path.join(__dirname, "..", "src", "index.html"));
  window.once("ready-to-show", () => window.show());

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:")) event.preventDefault();
  });
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const allowed = details.url.startsWith("file:") || details.url.startsWith("devtools:");
    callback({ cancel: !allowed });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("clipboard:write", (_event, value) => {
  if (typeof value !== "string" || value.length > 3000) {
    throw new Error("无效的准星代码");
  }
  clipboard.writeText(value);
  return true;
});

ipcMain.handle("app:info", () => ({
  version: app.getVersion(),
  portable: isPortable,
  dataPath: app.getPath("userData")
}));

ipcMain.handle("shell:show-data", () => shell.showItemInFolder(app.getPath("userData")));

