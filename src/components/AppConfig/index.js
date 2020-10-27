import React, { useMemo, useContext, createContext } from "react"
import { useLocalStorage } from "react-use"
import { defaultHotkeys } from "../HotkeyStorage"
import qs from "qs"

const configKeyNames = [
  "auth.provider",
  "auth.cognito.identityPoolId",
  "auth.cognito.region",
  "auth.cognito.userPoolId",
  "auth.cognito.userPoolWebClientId",
  "auth.cognito.mandatorySignIn",
  "auth.cognito.authenticationFlowType",
  "auth.cognito.storage.awsS3.bucket",
  "auth.cognito.storage.awsS3.region",
  "auth.cognito.password.minimumLength",
  "auth.cognito.password.requireLowercase",
  "auth.cognito.password.requireUppercase",
  "auth.cognito.password.requireNumbers",
  "auth.cognito.password.requireSymbols",
  "auth.s3iam.accessKeyId",
  "auth.s3iam.secretAccessKey",
  "auth.s3iam.region",
  "auth.proxy.corsproxy",
  "labelhelp.disabled",
  "labelhelp.apikey",
  "pluginUrls",
  "collaborationServer.url",
  ...defaultHotkeys.map(({ id }) => `hotkeys.${id}`),
]

const defaultAppConfig = {
  "auth.proxy.corsproxy":
    // TODO this is currently deployed on @seveibar's cloudflare, it'd be
    // better if it was deployed on the organization's cloudflare
    "https://corsproxy.seve.workers.dev/corsproxy/?apiurl={URL}",
  ...(window.preloaded_app_config || {}),
}

const jsonParseOrEmpty = (s) => {
  try {
    return JSON.parse(s)
  } catch (e) {
    return {}
  }
}

const initialAppConfig = {
  ...defaultAppConfig,
  ...jsonParseOrEmpty(window.localStorage.app_config),
  ...jsonParseOrEmpty(qs.parse(window.location.search.substr(1)).app_config),
}

// NOTE: appConfig should not allow any nested values
export const AppConfigContext = createContext({
  appConfig: initialAppConfig,
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
          return initialAppConfig[key]
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
        setAppConfig(initialAppConfig)
      },
    }
  }, [appConfig, setAppConfig])
  return (
    <AppConfigContext.Provider value={contextValue}>
      {children}
    </AppConfigContext.Provider>
  )
}
