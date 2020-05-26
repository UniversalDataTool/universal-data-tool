import { useFileContext } from "./"
import { useMemo } from "react"
import { setIn } from "seamless-immutable"

export const useActiveDataset = () => {
  const { file, setFile } = useFileContext()
  const result = useMemo(
    () =>
      !file || !file.content
        ? null
        : {
            dataset: file.content,
            setDataset: (newDataset) => {
              setFile(setIn(file, ["content"], newDataset))
            },
          },
    [file, setFile]
  )
  return result || {}
}
