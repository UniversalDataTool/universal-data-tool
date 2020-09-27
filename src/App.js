import React, { Suspense } from "react"
import Theme from "./components/Theme"
import WebApp from "./components/WebApp"
import DesktopApp from "./components/DesktopApp"
import { ToastProvider } from "./components/Toasts"
import useElectron from "./utils/use-electron.js"
import { AppConfigProvider } from "./components/AppConfig"
import { AuthProvider } from "./utils/auth-handlers/use-auth.js"
import { LabelHelpProvider } from "./components/LabelHelpView"
import { HotkeyStorageProvider } from "./components/HotkeyStorage"
import "./App.css"

import Loading from "./components/Loading"

// Importing Internalization file
import "./i18n"

export const App = () => {
  const electron = useElectron()
  return (
    <Suspense fallback={Loading}>
      <Theme>
        <AppConfigProvider>
          <AuthProvider>
            <LabelHelpProvider>
              <ToastProvider>
                <HotkeyStorageProvider>
                  {Boolean(electron) ? <DesktopApp /> : <WebApp />}
                </HotkeyStorageProvider>
              </ToastProvider>
            </LabelHelpProvider>
          </AuthProvider>
        </AppConfigProvider>
      </Theme>
    </Suspense>
  )
}

export default App
