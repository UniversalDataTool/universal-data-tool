import React from "react"
import Theme from "./components/Theme"
import LocalStorageApp from "./components/LocalStorageApp"
import DesktopApp from "./components/DesktopApp"
import { ToastProvider } from "./components/Toasts"
import useElectron from "./utils/use-electron.js"

export const App = () => {
  const electron = useElectron()
  return (
    <Theme>
      <ToastProvider>
        {Boolean(electron) ? <DesktopApp /> : <LocalStorageApp />}
      </ToastProvider>
    </Theme>
  )
}

export default App
