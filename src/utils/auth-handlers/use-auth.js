import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react"
import { useAppConfig } from "../../components/AppConfig"
import CognitoHandler from "./cognito-handler.js"

export const authProviders = ["cognito"]

const AuthContext = createContext({ authProvider: "none" })

export const AuthProvider = ({ children }) => {
  const { appConfig, fromConfig } = useAppConfig()
  const [handler, setHandler] = useState({ authProvider: "none" })
  const authProvider = fromConfig("auth.provider")
  const [handlerVersion, incHandlerVersion] = useReducer(
    (state) => state + 1,
    0
  )
  const [handlerErrorVersion, incHandlerErrorVersion] = useReducer(
    (state) => state + 1,
    0
  )

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
        incHandlerVersion()
        handler.hasChanged = false
      }
      if (handler.errorOccured) {
        incHandlerErrorVersion()
        handler.errorOccured = false
      }
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [handler, handlerVersion, handlerErrorVersion])

  const contextValue = useMemo(
    () => ({
      authProvider: handler.authProvider,
      ...(handler.getState ? handler.getState() : {}),
      // TODO remove setUser
      setUser: handler.setUser,
      logout: handler.logout,
      login: handler.login,
      completeSignUp: handler.completeSignUp,
      passwordValidator: handler.passwordValidator,
      handlerVersion,
      handlerErrorVersion,
    }),
    [handler, handlerVersion, handlerErrorVersion]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default useAuth
