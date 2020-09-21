import React, { createContext, useContext, useMemo } from "react"
import { defaultHotkeys } from "./default-hotkeys"
import { useAppConfig } from "../AppConfig"

export const HotkeyContext = createContext({
  hotkeys: defaultHotkeys,
  changeHotkey: (id, newBinding) => null,
})

export const useHotkeyStorage = () => useContext(HotkeyContext)

export const HotkeyStorageProvider = ({ children }) => {
  const { fromConfig, setInConfig, clearInConfig } = useAppConfig()

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

  const keyMap = useMemo(() => {
    const keyMap = {}
    for (const { id, binding } of hotkeys) {
      if (!binding) continue
      keyMap[id] = binding
    }
    return keyMap
  }, [hotkeys])

  const contextValue = useMemo(
    () => ({
      hotkeys,
      keyMap,
      clearHotkeys: () => {
        clearInConfig(hotkeys.map((key) => `hotkeys.${key.id}`))
      },
      changeHotkey: (id, newBinding) =>
        setInConfig(`hotkeys.${id}`, newBinding),
    }),
    [hotkeys, keyMap, clearInConfig, setInConfig]
  )

  return (
    <HotkeyContext.Provider value={contextValue}>
      {children}
    </HotkeyContext.Provider>
  )
}

export { defaultHotkeys }
