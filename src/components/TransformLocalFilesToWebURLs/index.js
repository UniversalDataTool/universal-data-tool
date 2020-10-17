import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import transformFileURLsToWebURLs from "./functions/transform-file-urls-to-web-urls"
import ProgressBar from "../ProgressBar"
import useElectron from "../../hooks/use-electron"
import { useTranslation } from "react-i18next"

const TransformLocalFilesToWebURLs = ({
  open,
  onClose,
  dataset,
  onChangeDataset,
}) => {
  const { t } = useTranslation()

  const [progress, setProgress] = useState(0)
  const { remote } = useElectron() || {}

  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Convert Local Files to Web URLs"
      actions={[
        {
          text: "Convert Local Files to Web URLs",
          onClick: async () =>
            await transformFileURLsToWebURLs({
              dataset,
              onChangeDataset,
              setProgress,
              remote,
            }),
        },
      ]}
    >
      {t("transform-local-files-to-web-urls-explanation")}
      <ProgressBar progress={progress} />
    </SimpleDialog>
  )
}

export default TransformLocalFilesToWebURLs
