import React from "react"
import Theme from "./components/Theme"
import LocalStorageApp from "./components/LocalStorageApp"
import DesktopApp from "./components/DesktopApp"

const DESKTOP = process.env.REACT_APP_DESKTOP === "true"

function App() {
  return <Theme>{DESKTOP ? <LocalStorageApp /> : <DesktopApp />}</Theme>
}

export default App
