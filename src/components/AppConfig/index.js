import React, { useMemo, useContext, createContext } from "react"
import { useLocalStorage } from "react-use"
import { defaultHotkeys } from "../HotkeyStorage"

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
  "auth.s3iam.access_key_id",
  "auth.s3iam.secret_access_key",
  "auth.s3iam.region",
  "auth.proxy.corsproxy",
  "labelhelp.disabled",
  "labelhelp.apikey",
  ...defaultHotkeys.map(({ id }) => `hotkeys.${id}`),
]

const defaultAppConfig = {
  "auth.proxy.corsproxy":
    // TODO this is currently deployed on @seveibar's cloudflare, it'd be
    // better if it was deployed on the organization's cloudflare
    "https://corsproxy.seve.workers.dev/corsproxy/?apiurl={URL}",
}

const jsonParseOrEmpty = (s) => {
  try {
    return JSON.parse(s)
  } catch (e) {
    return {}
  }
}

// NOTE: appConfig should not allow any nested values
export const AppConfigContext = createContext({
  appConfig: {
    ...defaultAppConfig,
    ...jsonParseOrEmpty(window.localStorage.app_config),
  },
  setAppConfig: (newConfig) => undefined,
  fromConfig: (key) => undefined,
  setInConfig: (key, value) => undefined,
  clearInConfig: (keys) => undefined,
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
        if (appConfig[key] === undefined) {
          return defaultAppConfig[key]
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
      clearInConfig: (keys) => {
        let config = { ...appConfig }
        for (const key of keys) {
          config = { ...config, [`${key}`]: null }
        }
        setAppConfig(config)
      },
    }
  }, [appConfig, setAppConfig])
  return (
    <AppConfigContext.Provider value={contextValue}>
      {children}
    </AppConfigContext.Provider>
  )
}
