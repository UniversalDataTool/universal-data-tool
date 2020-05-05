// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, shell } = require("electron")
const path = require("path")
const menuTemplate = require("./menu-template")
const { format: formatUrl } = require("url")

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // preload: path.join(__dirname, "preload.js")
    },
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  if (process.env.USE_DEV_SERVER) {
    // USAGE: DEV_SERVER_URL=https://e2a6dfb7.ngrok.io npm run start:desktop:dev
    mainWindow.loadURL(process.env.DEV_SERVER_URL || "http://localhost:6001")
  } else {
    mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "../build", "index.html"),
        protocol: "file",
        slashes: true,
      })
    )
  }

  // Don't open links in electron browser
  mainWindow.webContents.on("new-window", function (event, url) {
    event.preventDefault()
    shell.openExternal(url)
  })

  mainWindow.webContents.on("will-navigate", function (event, url) {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
