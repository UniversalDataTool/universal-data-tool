import React, { createContext, useContext, useMemo } from "react"
import { useAppConfig } from "../AppConfig"

export const defaultHotkeys = [
  {
    id: "save_and_next_sample",
    description: "Save and go to next sample",
    hotkey: "shift+n",
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
          return { ...item, hotkey: fromConfig(`hotkeys.${item.id}`) }
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

  return (
    <HotkeyContext.Provider value={contextValue}>
      {children}
    </HotkeyContext.Provider>
  )
}
