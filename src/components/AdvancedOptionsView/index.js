import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import MuiButton from "@material-ui/core/Button"
import { useUpdate } from "react-use"
import { styled } from "@material-ui/core/styles"
import usePosthog from "../../hooks/use-posthog"
import { useAppConfig } from "../AppConfig"
import { useHotkeyStorage } from "../HotkeyStorage"
import KeyboardShortcutManagerDialog from "../KeyboardShortcutManagerDialog"

import { useTranslation } from "react-i18next"

const Button = styled(MuiButton)({
  margin: 8,
})

export const AdvancedOptionsView = ({ onClickEditJSON, onClearLabelData }) => {
  const forceUpdate = useUpdate()
  const posthog = usePosthog()
  const { fromConfig, setInConfig } = useAppConfig()
  const { hotkeys, changeHotkey, clearHotkeys } = useHotkeyStorage()
  const [hotkeyDialogOpen, setHotkeyDialogOpen] = useState(false)

  // internalization hook
  const { t } = useTranslation()

  return (
    <Box padding={2}>
      <Button
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to delete all your label data? Click OK to delete."
            )
          ) {
            onClearLabelData()
          }
        }}
        variant="outlined"
      >
        {t("clear-labels")}
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          if (posthog.has_opted_out_capturing()) {
            posthog.opt_in_capturing()
          } else {
            posthog.opt_out_capturing()
          }
          forceUpdate()
        }}
      >
        {posthog.has_opted_out_capturing() ? "Enable" : "Disable"}{" "}
        {t("telemetry")}
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          // TODO store in appConfig
          const response = window.prompt(
            "Input URL for new collaboration server (empty to use universaldatatool.com):",
            fromConfig("collaborationServer.url")
          )
          if (response === null) return
          setInConfig("collaborationServer.url", response)
        }}
      >
        {t("custom-collaboration-server")}
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          setInConfig(
            "labelhelp.disabled",
            !Boolean(fromConfig("labelhelp.disabled"))
          )
        }}
      >
        {fromConfig("labelhelp.disabled") ? "Enable" : "Disable"}{" "}
        {t("label-help")}
      </Button>
      {!fromConfig("labelhelp.disabled") && (
        <Button
          variant="outlined"
          disabled={Boolean(fromConfig("labelhelp.disabled"))}
          onClick={() => {
            const response = window.prompt(
              "Label Help API Key:",
              fromConfig("labelhelp.apikey") || ""
            )
            if (response === null) return
            setInConfig("labelhelp.apikey", response)
          }}
        >
          {t("label-help-api-key")}
        </Button>
      )}
      <Button
        variant="outlined"
        onClick={() => {
          setHotkeyDialogOpen(true)
        }}
      >
        Change/View Hotkeys
      </Button>
      <KeyboardShortcutManagerDialog
        open={hotkeyDialogOpen}
        hotkeyList={hotkeys}
        onClose={() => setHotkeyDialogOpen(false)}
        onClearHotkeys={clearHotkeys}
        onChangeHotkey={(hotkey, newBinding) =>
          changeHotkey(hotkey.id, newBinding)
        }
      />
    </Box>
  )
}

export default AdvancedOptionsView
