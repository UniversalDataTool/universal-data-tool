const path = require("path")
const { ipcMain, shell, dialog } = require("electron")
const fs = require("fs")

module.exports = [
  {
    label: "File",
    submenu: [
      {
        role: "new",
        label: "New",
        submenu: [
          {
            label: "Empty",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {})
            }
          },
          {
            label: "Computer Vision",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label
              })
            }
          },
          {
            label: "Data Entry",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label
              })
            }
          },
          {
            label: "Natural Language",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label
              })
            }
          },
          {
            label: "Audio Transcription",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label
              })
            }
          },
          {
            label: "Composite",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label
              })
            }
          }
        ]
      },
      {
        role: "open",
        accelerator: "CommandOrControl+O",
        label: "Open",
        click: (menuItem, currentWindow) => {
          dialog
            .showOpenDialog(currentWindow, { properties: ["openFile"] })
            .then(({ cancelled, filePaths }) => {
              if (cancelled || filePaths.length === 0) return
              currentWindow.webContents.send("open-file", {
                fileName: path.basename(filePaths[0]),
                filePath: filePaths[0],
                content: fs.readFileSync(filePaths[0]).toString(),
                id: filePaths[0]
              })
            })
        }
      },
      {
        role: "save",
        accelerator: "CommandOrControl+S",
        label: "Save",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("save-file")
        }
      },
      {
        role: "save",
        accelerator: "CommandOrControl+Shift+S",
        label: "Save As",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("save-file-as")
        }
      },
      {
        role: "export",
        label: "Export CSV",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("export-to-csv")
        }
      },
      { type: "separator" },
      {
        role: "quit"
      }
    ]
  },
  {
    label: "Navigate",
    submenu: [
      {
        label: "Welcome Page",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("open-welcome-page")
        }
      }
    ]
  },
  {
    label: "About",
    submenu: [
      {
        label: "Github",
        click: () => {
          shell.openItem(
            "https://github.com/openhumanannotation/universal-data-tool"
          )
        }
      }
    ]
  },
  {
    label: "Debug",
    submenu: [{ role: "reload" }, { role: "toggledevtools" }]
  }
]
