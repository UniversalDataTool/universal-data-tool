import React, { Suspense } from "react"
import Theme from "./components/Theme"
import App from "./components/App"
import { RecoilRoot } from "recoil"
import { ToastProvider } from "./components/Toasts"
import { AppConfigProvider } from "./components/AppConfig"
import { AuthProvider } from "./utils/auth-handlers/use-auth.js"
import { LabelHelpProvider } from "./components/LabelHelpView"
import { HotkeyStorageProvider } from "./components/HotkeyStorage"
import "./App.css"

import Loading from "./components/Loading"

// Importing Internalization file
import "./i18n"

export const AppWithContexts = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={Loading}>
        <Theme>
          <AppConfigProvider>
            <AuthProvider>
              <LabelHelpProvider>
                <ToastProvider>
                  <HotkeyStorageProvider>
                    <App />
                  </HotkeyStorageProvider>
                </ToastProvider>
              </LabelHelpProvider>
            </AuthProvider>
          </AppConfigProvider>
        </Theme>
      </Suspense>
    </RecoilRoot>
  )
}

export default AppWithContexts
