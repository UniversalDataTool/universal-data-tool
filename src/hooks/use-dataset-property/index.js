import { useEffect, useState, useReducer } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"

export default (datasetPropertyKey: string) => {
  const [propVal, setPropVal] = useState()
  const [propVersion, incPropVersion] = useReducer((state) => state + 1, 0)
  const [dm] = useActiveDatasetManager()

  useEffect(() => {
    if (!dm || !datasetPropertyKey) return
    dm.on("dataset-property-changed", ({ key }) => {
      if (key === datasetPropertyKey) {
        incPropVersion()
      }
    })
  }, [dm, datasetPropertyKey])

  useEffect(() => {
    if (!dm || !datasetPropertyKey) return
    dm.getDatasetProperty(datasetPropertyKey).then((newPropVal) => {
      setPropVal(newPropVal)
    })
  }, [dm, propVersion, datasetPropertyKey])

  // interface -> updateInterface
  const updateFunctionKeyName = `update${datasetPropertyKey[0].toUpperCase()}${datasetPropertyKey.slice(
    1
  )}`

  if (!dm || !datasetPropertyKey)
    return {
      [`${datasetPropertyKey}Loading`]: true,
      [updateFunctionKeyName]: () => {
        throw new Error(`${datasetPropertyKey} isn't loaded`)
      },
    }

  return {
    [datasetPropertyKey]: propVal,
    [updateFunctionKeyName]: async (newPropVal) => {
      await dm.setDatasetProperty(datasetPropertyKey, newPropVal)
    },
  }
}
