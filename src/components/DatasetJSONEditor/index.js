import React from "react"

import RawJSONEditor from "../RawJSONEditor"
import useDataset from "../../hooks/use-dataset"

export const DatasetJSONEditor = () => {
  const [dataset, setDataset] = useDataset()
  return (
    <RawJSONEditor key="rawJSONEditor" content={dataset} onSave={setDataset} />
  )
}

export default DatasetJSONEditor
