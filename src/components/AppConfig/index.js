import React, { useMemo, useContext, createContext } from "react"
import { useLocalStorage } from "react-use"

export const AppConfigContext = createContext({})

export const useAppConfig = () => useContext(AppConfigContext)

export const AppConfigProvider = ({ children }) => {
  const [appConfig, setAppConfig] = useLocalStorage("app_config", {})
  const contextValue = useMemo(() => ({ appConfig, setAppConfig }), [
    appConfig,
    setAppConfig,
  ])
  return (
    <AppConfigContext.Provider value={contextValue}>
      {children}
    </AppConfigContext.Provider>
  )
}
