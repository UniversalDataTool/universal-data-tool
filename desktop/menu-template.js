module.exports = [
  {
    label: "File",
    submenu: [
      {
        role: "new",
        label: "New",
        submenu: [
          { label: "Empty" },
          { label: "Computer Vision" },
          { label: "Data Entry" },
          { label: "Natural Language" },
          { label: "Audio Transcription" },
          { label: "Composite" }
        ]
      },
      {
        role: "open",
        label: "Open"
      },
      {
        role: "quit"
      }
    ]
  },
  {
    label: "About",
    submenu: [{ label: "Github" }]
  }
]
