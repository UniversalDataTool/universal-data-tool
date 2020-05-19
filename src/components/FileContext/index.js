import React, { useContext, createContext } from "react"

export const FileContext = createContext({})

export const useFileContext = () => useContext(FileContext)
export const useActiveDataset = () => {
  const { file } = useFileContext()
  if (file.content) return { dataset: file.content }
  return null
}
