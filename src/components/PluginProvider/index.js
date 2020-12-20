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
    let pluginChangeWatcherInterval
    const lastReloadTime = new Date().toGMTString()
    const pluginUrlsToWatch = []
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
            tabPlugins,
            autoReload,
          } = (await import(/* webpackIgnore: true */ pluginUrl)).default()

          plugins.push(
            ...transformPlugins.map((p) => ({
              ...p,
              type: "transform",
              pluginUrl,
            }))
          )
          plugins.push(
            ...importPlugins.map((p) => ({ ...p, type: "import", pluginUrl }))
          )
          plugins.push(
            ...interfacePlugins.map((p) => ({
              ...p,
              type: "interface",
              pluginUrl,
            }))
          )
          plugins.push(
            ...authenticationPlugins.map((p) => ({
              ...p,
              type: "authentication",
              pluginUrl,
            }))
          )
          plugins.push(
            ...tabPlugins.map((p) => ({
              ...p,
              type: "tab",
              pluginUrl,
            }))
          )

          if (autoReload) {
            pluginUrlsToWatch.push(pluginUrl)
          }
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

      if (pluginUrlsToWatch.length > 0) {
        pluginChangeWatcherInterval = setInterval(() => {
          // TODO check for 304s against the plugin and reload if necessary
        }, 1000)
      }
    }
    loadPlugins()

    return () => {
      clearInterval(pluginChangeWatcherInterval)
    }

    // eslint-disable-next-line
  }, [fromConfig("pluginUrls")])
}
