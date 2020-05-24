import React, { createContext, useContext, useMemo } from "react"
import { useAppConfig } from "../AppConfig"
import { HotKeys } from "react-hotkeys"

export const defaultHotkeys = [
  {
    id: "switch_to_label",
    description: "Go to Labels Tab",
    binding: "shift+3",
  },
  {
    id: "switch_to_setup",
    description: "Go to Setup Tab",
    binding: "shift+1",
  },
  {
    id: "switch_to_samples",
    description: "Go to Samples Tab",
    binding: "shift+2",
  },
  {
    id: "select_tool",
    description: "Switch to the Select Tool",
    binding: "escape",
  },
  {
    id: "zoom_tool",
    description: "Select the Zoom Tool",
    binding: "z",
  },
  {
    id: "create_point",
    description: "Create a point",
  },
  {
    id: "pan_tool",
    description: "Select the Pan Tool",
  },
  {
    id: "create_polygon",
    description: "Create a Polygon",
  },
  {
    id: "create_pixel",
    description: "Create a Pixel Mask",
  },
  {
    id: "save_and_previous_sample",
    description: "Save and go to previous sample",
  },
  {
    id: "save_and_next_sample",
    description: "Save and go to next sample",
  },
  {
    id: "save_and_exit_sample",
    description: "Save and exit current sample",
  },
  {
    id: "exit_sample",
    description: "Exit sample without saving",
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
