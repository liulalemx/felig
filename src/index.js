const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const similarity_checker = require("./similarity_checker");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

ipcMain.handle("sim_check", async (event, filesList, query) => {
  const { default: felig_toolkit } = await import("felig-toolkit");

  const outputsPath = path.join(__dirname, "/outputs");

  // Operations on document
  felig_toolkit.indexer(filesList, outputsPath, "doc");
  felig_toolkit.weigh_terms(
    path.join(outputsPath, "/docIndexFile.json"),
    outputsPath,
    "doc"
  );

  //Operations on query
  felig_toolkit.indexer(query, outputsPath, "query");
  felig_toolkit.weigh_terms(
    path.join(outputsPath, "/queryIndexFile.json"),
    outputsPath,
    "query"
  );

  let b = similarity_checker.sim_checker(
    path.join(outputsPath, "/docWeightedTermsFile.json"),
    path.join(outputsPath, "/queryWeightedTermsFile.json"),
    filesList
  );
  return b;
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// app.whenReady().then(() => {

// });
