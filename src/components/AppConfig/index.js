import React, { useMemo, useContext, createContext } from "react"
import { useLocalStorage } from "react-use"

const configKeyNames = [
  "auth.provider",
  "auth.cognito.identity_pool_id",
  "auth.cognito.region",
  "auth.cognito.user_pool_id",
  "auth.cognito.user_pool_web_client_id",
  "auth.cognito.mandatory_sign_in",
  "auth.cognito.authentication_flow_type",
  "auth.cognito.storage.aws_s3.bucket",
  "auth.cognito.storage.aws_s3.region",
  "labelhelp.disabled",
  "labelhelp.apikey",
]

// NOTE: appConfig should not allow any nested values
export const AppConfigContext = createContext({
  appConfig: {},
  setAppConfig: (newConfig) => undefined,
  fromConfig: (key) => undefined,
  setInConfig: (key, value) => undefined,
})

export const useAppConfig = () => useContext(AppConfigContext)

export const AppConfigProvider = ({ children }) => {
  const [appConfig, setAppConfig] = useLocalStorage("app_config", {})
  const contextValue = useMemo(() => {
    return {
      appConfig,
      setAppConfig,
      fromConfig: (key) => {
        if (!configKeyNames.includes(key)) {
          throw new Error(`Unknown config key name "${key}"`)
        }
        return appConfig[key]
      },
      setInConfig: (key, value) => {
        if (
          typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean" &&
          value !== undefined &&
          value !== null
        ) {
          throw new Error(
            `Config can only have boolean/strings/numbers/null/undefined, something tried to set appConfig["${key}"] = ${JSON.stringify(
              value
            )}`
          )
        }
        if (!configKeyNames.includes(key)) {
          throw new Error(`Unknown config key name "${key}"`)
        }
        setAppConfig({ ...appConfig, [key]: value })
      },
    }
  }, [appConfig, setAppConfig])
  return (
    <AppConfigContext.Provider value={contextValue}>
      {children}
    </AppConfigContext.Provider>
  )
}
