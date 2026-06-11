const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = process.env.ELECTRON_DEV === "true";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    console.log("Loading development server...");
    win.loadURL("http://localhost:5173");
  } else {
    console.log("Loading production build...");
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
