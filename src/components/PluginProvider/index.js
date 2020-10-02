import { useEffect } from "react"
import { useAppConfig } from "../AppConfig"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import { useToasts } from "../Toasts"

const pluginsState = atom({
  key: "plugins",
  default: [],
})

export const usePlugins = () => useRecoilValue(pluginsState)

export default () => {
  // eslint-disable-next-line
  const [plugins, setPlugins] = useRecoilState(pluginsState)
  const { fromConfig } = useAppConfig()
  const { addToast } = useToasts()

  useEffect(() => {
    async function loadPlugins() {
      const pluginUrls = (fromConfig("pluginUrls") || "")
        .split("\n")
        .filter(Boolean)

      const plugins = []

      for (const pluginUrl of pluginUrls) {
        try {
          const {
            transformPlugins,
            importPlugins,
            interfacePlugins,
            authenticationPlugins,
          } = (await import(/* webpackIgnore: true */ pluginUrl)).default()

          plugins.push(
            ...transformPlugins.map((p) => ({ ...p, type: "transform" }))
          )
          plugins.push(...importPlugins.map((p) => ({ ...p, type: "import" })))
          plugins.push(
            ...interfacePlugins.map((p) => ({ ...p, type: "interface" }))
          )
          plugins.push(
            ...authenticationPlugins.map((p) => ({
              ...p,
              type: "authentication",
            }))
          )
        } catch (e) {
          // TODO display broken plugin more nicely, using regex extraction of
          // package and version
          addToast(
            "Couldn't load plugin: " + pluginUrl + "\n\n" + e.toString(),
            "error"
          )
        }
      }
      setPlugins(plugins)
    }
    loadPlugins()
    // eslint-disable-next-line
  }, [fromConfig("pluginUrls")])
}
