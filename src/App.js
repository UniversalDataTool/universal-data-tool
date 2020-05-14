import React from "react"
import Theme from "./components/Theme"
import LocalStorageApp from "./components/LocalStorageApp"
import DesktopApp from "./components/DesktopApp"
import { ToastProvider } from "./components/Toasts"
import useElectron from "./utils/use-electron.js"
import { AppConfigProvider } from "./components/AppConfig"
import "./App.css"

export const App = () => {
  const electron = useElectron()
  return (
    <Theme>
      <AppConfigProvider>
        <ToastProvider>
          {Boolean(electron) ? <DesktopApp /> : <LocalStorageApp />}
        </ToastProvider>
      </AppConfigProvider>
    </Theme>
  )
}

export default App
