import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react"
import { useAppConfig } from "../../components/AppConfig"
import CognitoHandler from "./cognito-handler.js"
import { useUpdate } from "react-use"

export const authProviders = ["cognito"]

const AuthContext = createContext({ authProvider: "none" })

export const AuthProvider = ({ children }) => {
  const { appConfig, fromConfig } = useAppConfig()
  const [handler, setHandler] = useState({ authProvider: "none" })
  const authProvider = fromConfig("auth.provider")
  const forceUpdate = useUpdate()

  useEffect(() => {
    if (handler && handler.authProvider === authProvider) return
    if (authProvider === "cognito") {
      setHandler(new CognitoHandler(appConfig))
    }
  }, [authProvider, appConfig, handler])

  useEffect(() => {
    if (!handler) return
    const interval = setInterval(() => {
      if (handler.hasChanged) {
        forceUpdate()
        handler.hasChanged = false
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [handler, forceUpdate])

  const contextValue = useMemo(
    () => ({
      authProvider: handler.authProvider,
      ...(handler.getState ? handler.getState() : {}),
      // TODO remove setUser
      setUser: handler.setUser,
      logout: handler.logout,
      login: handler.login,
    }),
    [handler]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default useAuth
