import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react"
import { useAppConfig } from "../../components/AppConfig"
import CognitoHandler from "./cognito-handler.js"

const authProviders = ["cognito"]

const AuthContext = createContext({ authProvider: "none" })

export const AuthProvider = ({ children }) => {
  const { appConfig, fromConfig } = useAppConfig()
  const [handler, setHandler] = useState({ authProvider: "none" })
  const authProvider = fromConfig("auth.provider")

  useEffect(() => {
    if (handler && handler.type === authProvider) return
    if (authProvider === "cognito") {
      setHandler(new CognitoHandler(appConfig))
    }
  }, [authProvider, appConfig, handler])

  const contextValue = useMemo(() => {
    handler.hasChanged = false
    return handler
    // eslint-disable-next-line
  }, [handler, handler.hasChanged])
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default useAuth
