import { useContext, createContext } from "react"

export const FileContext = createContext({})

export const useFileContext = () => useContext(FileContext)

export { useActiveDataset } from "./use-active-dataset.js"
