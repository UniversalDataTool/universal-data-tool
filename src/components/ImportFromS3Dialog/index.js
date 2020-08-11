import React from "react"
import SimpleDialog from "../SimpleDialog"

export const ImportFromS3Dialog = ({ open, onClose }) => {
  return (
    <SimpleDialog onClose={onClose} open={open} title="Import from S3">
      This is a work in progress! Available soon!
    </SimpleDialog>
  )
}

export default ImportFromS3Dialog
