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
            },
          },
          {
            label: "Computer Vision",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label,
              })
            },
          },
          {
            label: "Data Entry",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label,
              })
            },
          },
          {
            label: "Natural Language",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label,
              })
            },
          },
          {
            label: "Audio Transcription",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label,
              })
            },
          },
          {
            label: "Composite",
            click: (menuItem, currentWindow) => {
              currentWindow.webContents.send("new-file", {
                templateName: menuItem.label,
              })
            },
          },
        ],
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
                name: path.basename(filePaths[0]),
                path: filePaths[0],
                content: fs.readFileSync(filePaths[0]).toString(),
              })
            })
        },
      },
      {
        role: "copy",
        label: "Copy",
        accelerator: "CommandOrControl+C",
        selector: "copy:",
      },
      {
        role: "paste",
        label: "Paste",
        accelerator: "CommandOrControl+V",
        selector: "paste:",
      },
      {
        role: "selectAll",
        label: "Select All",
        accelerator: "CommandOrControl+A",
        selector: "selectAll:",
      },
      {
        role: "cut",
        label: "Cut",
        accelerator: "CommandOrControl+X",
        selector: "cut:",
      },
      {
        role: "undo",
        label: "Undo",
        accelerator: "CommandOrControl+Z",
        selector: "undo:",
      },
      {
        role: "save",
        accelerator: "CommandOrControl+S",
        label: "Save",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("save-file")
        },
      },
      {
        role: "save",
        accelerator: "CommandOrControl+Shift+S",
        label: "Save As",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("save-file-as")
        },
      },
      {
        role: "export",
        label: "Export CSV",
        click: (menuItem, currentWindow) => {
          currentWindow.webContents.send("export-to-csv")
        },
      },
      { type: "separator" },
      {
        role: "quit",
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {
        role: "copy",
        label: "Copy",
        accelerator: "CommandOrControl+C",
        selector: "copy:",
      },
      {
        role: "paste",
        label: "Paste",
        accelerator: "CommandOrControl+V",
        selector: "paste:",
      },
      {
        role: "selectAll",
        label: "Select All",
        accelerator: "CommandOrControl+A",
        selector: "selectAll:",
      },
      {
        role: "cut",
        label: "Cut",
        accelerator: "CommandOrControl+X",
        selector: "cut:",
      },
      {
        role: "undo",
        label: "Undo",
        accelerator: "CommandOrControl+Z",
        selector: "undo:",
      },
    ],
  },
  {
    label: "About",
    submenu: [
      {
        label: "Github",
        click: () => {
          shell.openExternal(
            "https://github.com/openhumanannotation/universal-data-tool"
          )
        },
      },
    ],
  },
  {
    label: "Debug",
    submenu: [{ role: "reload" }, { role: "toggledevtools" }],
  },
]
