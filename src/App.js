import React from "react"
import Theme from "./components/Theme"
import LocalStorageApp from "./components/LocalStorageApp"
import DesktopApp from "./components/DesktopApp"
import { ToastProvider } from "./components/Toasts"

const DESKTOP = process.env.REACT_APP_DESKTOP === "true"

function App() {
  return (
    <Theme>
      <ToastProvider>
        {DESKTOP ? <LocalStorageApp /> : <DesktopApp />}
      </ToastProvider>
    </Theme>
  )
}

export default App
