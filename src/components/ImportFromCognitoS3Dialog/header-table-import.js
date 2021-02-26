import React from "react"
import {
  Settings as SettingsIcon,
  Storage as StorageIcon,
} from "@material-ui/icons/"
import { useTranslation } from "react-i18next"
import { Button, IconButton } from "@material-ui/core/"

const selectedStyle = { color: "DodgerBlue" }

const HeaderTable = ({ configImport, setConfigImport }) => {
  const { t } = useTranslation()
  const loadAssetsOrAnnotations = () => {
    setConfigImport({
      ...configImport,
      loadAssetsIsSelected: !configImport.loadAssetsIsSelected,
    })
  }

  return (
    <div>
      {configImport.loadAssetsIsSelected ? (
        <Button
          style={selectedStyle}
          onClick={loadAssetsOrAnnotations}
          disabled
        >
          {t("load-assets")}
        </Button>
      ) : (
        <Button onClick={loadAssetsOrAnnotations}>{t("load-assets")}</Button>
      )}
      {configImport.loadAssetsIsSelected ? (
        <Button onClick={loadAssetsOrAnnotations}>
          {t("load-annotations")}
        </Button>
      ) : (
        <Button
          style={selectedStyle}
          onClick={loadAssetsOrAnnotations}
          disabled
        >
          {t("load-annotations")}
        </Button>
      )}
      <IconButton
        onClick={() => {
          setConfigImport({
            ...configImport,
            contentDialogBoxIsSetting: !configImport.contentDialogBoxIsSetting,
          })
        }}
      >
        {configImport.contentDialogBoxIsSetting ? (
          <StorageIcon id="StorageIcon" />
        ) : (
          <SettingsIcon id="SettingIcon" />
        )}
      </IconButton>
    </div>
  )
}
export default HeaderTable
