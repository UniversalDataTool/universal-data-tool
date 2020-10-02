import React, { useState, useEffect } from "react"
import SimpleDialog from "../SimpleDialog"
import TextAreaWithUpload from "../TextAreaWithUpload"
import { useAppConfig } from "../AppConfig"

export const ManagePluginsDialog = ({ onClose, open }) => {
  const { fromConfig, setInConfig } = useAppConfig()
  const [content, setContent] = useState()
  useEffect(() => {
    if (!open) return
    setContent(fromConfig("pluginUrls") || "")
    //eslint-disable-next-line
  }, [open])

  return (
    <SimpleDialog
      title="Manage Plugins"
      onClose={onClose}
      open={open}
      actions={[
        {
          text: "Save Plugins",
          onClick: () => {
            setInConfig(
              "pluginUrls",
              content
                .trim()
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .join("\n")
            )
            onClose()
          },
        },
      ]}
    >
      <TextAreaWithUpload
        content={content}
        onChangeContent={setContent}
        placeholder={
          "Write the URLs to each plugin here, one plugin url per line.\n\ne.g.\nhttps://unpkg.com/udt-transform-delete-samples@1.0.4/plugin-config.js\n\nYou can also upload a text file with the urls."
        }
      />
    </SimpleDialog>
  )
}

export default ManagePluginsDialog
