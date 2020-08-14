import React from "react"
import SimpleDialog from "../SimpleDialog"

export const UploadToS3Dialog = ({ open, onClose }) => {
  return (
    <SimpleDialog onClose={onClose} open={open} title="Upload via S3">
      This is a work in progress! Available soon!{" "}
      <a href="https://github.com/UniversalDataTool/universal-data-tool/issues/252">
        Track the progress here.
      </a>
    </SimpleDialog>
  )
}

export default UploadToS3Dialog
