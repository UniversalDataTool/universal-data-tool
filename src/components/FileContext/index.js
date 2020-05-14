import React, { useContext, createContext } from "react"

export const FileContext = createContext({})

export const useFileContext = () => useContext(FileContext)
