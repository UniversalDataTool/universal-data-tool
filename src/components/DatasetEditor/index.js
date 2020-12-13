// @flow

import React, { useState, useEffect, useMemo } from "react"
import { makeStyles } from "@material-ui/core/styles"

import { HeaderWithContainer } from "../Header"
import SamplesView from "../SamplesView"
import SetupPage from "../SetupPage"
import useElectron from "../../hooks/use-electron"
import useTimeToCompleteSample from "../../hooks/use-time-to-complete-sample.js"
import { useToasts } from "../Toasts"
import useEventCallback from "use-event-callback"
import usePosthog from "../../hooks/use-posthog"
import classnames from "classnames"
import LabelView from "../LabelView"
import useIsLabelOnlyMode from "../../hooks/use-is-label-only-mode"
import { HotKeys } from "react-hotkeys"
import { useHotkeyStorage } from "../HotkeyStorage"
import useInterface from "../../hooks/use-interface"
import useSummary from "../../hooks/use-summary"
import useRemoveSamples from "../../hooks/use-remove-samples"

import "brace/mode/javascript"
import "brace/theme/github"

const useStyles = makeStyles({
  headerButton: {
    color: "#fff",
  },
  saveIcon: {
    marginRight: 4,
  },
  editIcon: {
    marginLeft: 4,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
  },
})

export default ({
  content,
  inSession,
  url,
  onChangeDataset = () => null,
  onChangeFile,
  onFileDrop,
  initialMode = "setup",
  authConfig,
  user,
  recentItems,
  selectedBrush,
}) => {
  const labelOnlyMode = useIsLabelOnlyMode()
  const c = useStyles()
  const { addToast } = useToasts()
  const [mode, changeMode] = useState(labelOnlyMode ? "label" : initialMode)
  const { ipcRenderer } = useElectron() || {}
  const posthog = usePosthog()
  const { iface } = useInterface()
  const { summary } = useSummary()
  const removeSamples = useRemoveSamples()

  const [sampleIndex, setSampleIndex] = useState(null)

  const headerTabs = labelOnlyMode ? ["Label"] : ["Setup", "Samples", "Label"]

  const [
    sampleTimeToComplete,
    changeSampleTimeToComplete,
  ] = useTimeToCompleteSample()

  useEffect(() => {
    if (!ipcRenderer) return
    const onOpenSettingsPage = () => changeMode("settings")
    const onOpenSamplesPage = () => changeMode("samples")
    const onOpenLabelPage = () => changeMode("label")
    ipcRenderer.on("open-settings-page", onOpenSettingsPage)
    ipcRenderer.on("open-samples-page", onOpenSamplesPage)
    ipcRenderer.on("open-label-page", onOpenLabelPage)
    return () => {
      ipcRenderer.removeListener("open-settings-page", onOpenSettingsPage)
      ipcRenderer.removeListener("open-samples-page", onOpenSamplesPage)
      ipcRenderer.removeListener("open-label-page", onOpenLabelPage)
    }
  }, [ipcRenderer])

  useEffect(() => {
    posthog.people.set({
      average_time_to_complete_sample: sampleTimeToComplete,
    })
  }, [sampleTimeToComplete, posthog.people])

  useEffect(() => {
    if (mode !== "label") setSampleIndex(null)
    posthog.capture("open_editor_tab", { tab: mode })
  }, [mode, posthog])

  const onChangeTab = useEventCallback((tab) => changeMode(tab.toLowerCase()))

  const shortcutHandlers = useMemo(
    () => ({
      switch_to_label: () => changeMode("label"),
      switch_to_setup: () => changeMode("setup"),
      switch_to_samples: () => changeMode("samples"),
    }),
    [changeMode]
  )

  const { keyMap } = useHotkeyStorage()

  return (
    <HotKeys allowChanges handlers={shortcutHandlers} keyMap={keyMap}>
      <div className={classnames(c.container, "universaldatatool")}>
        <HeaderWithContainer
          title={null}
          onChangeTab={onChangeTab}
          currentTab={mode}
          tabs={headerTabs}
        >
          <div style={{ height: "100%", overflowY: "scroll" }}>
            {mode === "setup" && (
              <SetupPage
                onClearLabelData={() => {
                  removeSamples(summary.samples.map((s) => s._id))
                }}
                onChange={(newDataset) => {
                  if (
                    iface.type !== newDataset.interface.type &&
                    iface.type !== "empty" &&
                    summary.samples.some((s) => s?.hasAnnotation)
                  ) {
                    addToast(
                      "Changing label types can cause label data issues. You must clear all label data first.",
                      "error"
                    )
                    return
                  }
                  onChangeDataset(newDataset)
                }}
              />
            )}
            {mode === "samples" && (
              <SamplesView
                openSampleLabelEditor={(sampleIndex) => {
                  setSampleIndex(sampleIndex)
                  posthog.capture("open_sample", {
                    interface_type: iface?.type,
                  })
                  changeMode("label")
                }}
                user={user}
              />
            )}
            {mode === "label" && (
              <LabelView
                selectedBrush={selectedBrush}
                sampleIndex={sampleIndex}
                onChangeSampleIndex={setSampleIndex}
                sampleTimeToComplete={sampleTimeToComplete}
                onChangeSampleTimeToComplete={changeSampleTimeToComplete}
                onChangeDataset={onChangeDataset}
                onClickSetup={() => changeMode("setup")}
              />
            )}
          </div>
        </HeaderWithContainer>
      </div>
    </HotKeys>
  )
}
