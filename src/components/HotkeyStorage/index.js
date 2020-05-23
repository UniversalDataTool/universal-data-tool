import React, { createContext, useContext, useMemo } from "react"
import { useAppConfig } from "../AppConfig"
import { HotKeys } from "react-hotkeys"

export const defaultHotkeys = [
  {
    id: "switch_to_label",
    description: "Go to Labels Tab",
    binding: "shift+l",
  },
  {
    id: "switch_to_setup",
    description: "Go to Setup Tab",
  },
  {
    id: "switch_to_samples",
    description: "Go to Samples Tab",
  },
]

export const HotkeyContext = createContext({
  hotkeys: defaultHotkeys,
  changeHotkey: (id, newBinding) => null,
})

export const useHotkeyStorage = () => useContext(HotkeyContext)

export const HotkeyStorageProvider = ({ children }) => {
  const { fromConfig, setInConfig } = useAppConfig()

  const hotkeys = useMemo(
    () =>
      defaultHotkeys.map((item) => {
        if (fromConfig(`hotkeys.${item.id}`)) {
          return { ...item, binding: fromConfig(`hotkeys.${item.id}`) }
        } else {
          return item
        }
      }),
    [fromConfig]
  )

  const contextValue = useMemo(
    () => ({
      hotkeys,
      changeHotkey: (id, newBinding) =>
        setInConfig(`hotkeys.${id}`, newBinding),
    }),
    [setInConfig, hotkeys]
  )

  const keyMap = useMemo(() => {
    const keyMap = {}
    for (const { id, binding } of hotkeys) keyMap[id] = binding
    return keyMap
  }, [hotkeys])

  return (
    <HotkeyContext.Provider value={contextValue}>
      <HotKeys keyMap={keyMap}>{children}</HotKeys>
    </HotkeyContext.Provider>
  )
}
