import React from "react"
import Theme from "./components/Theme"
import LocalStorageApp from "./components/LocalStorageApp"
import DesktopApp from "./components/DesktopApp"
import { ToastProvider } from "./components/Toasts"
import useElectron from "./utils/use-electron.js"
import { AppConfigProvider } from "./components/AppConfig"
import { AuthProvider } from "./utils/auth-handlers/use-auth.js"
import { LabelHelpProvider } from "./components/LabelHelpView"
import "./App.css"

export const App = () => {
  const electron = useElectron()
  return (
    <Theme>
      <AppConfigProvider>
        <AuthProvider>
          <LabelHelpProvider>
            <ToastProvider>
              {Boolean(electron) ? <DesktopApp /> : <LocalStorageApp />}
            </ToastProvider>
          </LabelHelpProvider>
        </AuthProvider>
      </AppConfigProvider>
    </Theme>
  )
}

export default App
