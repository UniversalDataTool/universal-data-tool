// @flow

import React, { useState, useEffect, useMemo } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Header from "../Header"
import EditableTitleText from "./EditableTitleText.js"
import SamplesView from "../SamplesView"
import SetupPage from "../SetupPage"
import EditSampleDialog from "../EditSampleDialog"
import useElectron from "../../hooks/use-electron"
import useTimeToCompleteSample from "../../hooks/use-time-to-complete-sample.js"
import TextField from "@material-ui/core/TextField"
import { useToasts } from "../Toasts"
import { setIn, without } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import usePosthog from "../../hooks/use-posthog"
import classnames from "classnames"
import LabelView from "../LabelView"
import useIsLabelOnlyMode from "../../hooks/use-is-label-only-mode"
import { HotKeys } from "react-hotkeys"
import { useHotkeyStorage } from "../HotkeyStorage"
import useInterface from "../../hooks/use-interface"

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
  file,
  datasetName = "Universal Data Tool",
  dataset,
  content,
  inSession,
  url,
  fileName = "unnamed",
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
  var [valueDisplay, setValueDisplay] = useState(fileName)
  const c = useStyles()
  const { addToast } = useToasts()
  const [mode, changeMode] = useState(labelOnlyMode ? "label" : initialMode)
  const [sampleInputEditor, changeSampleInputEditor] = useState({})
  const { ipcRenderer } = useElectron() || {}
  const posthog = usePosthog()
  const { iface } = useInterface()

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
        <Header
          title={
            inSession ? (
              <TextField
                label="Share Link"
                title="share-link"
                value={url}
                variant="outlined"
                size="small"
              />
            ) : (
              <EditableTitleText
                label="File Name"
                onChange={(newName) => {
                  onChangeFile(setIn(file, ["fileName"], newName))
                  setValueDisplay(newName)
                }}
                value={valueDisplay || ""}
              />
            )
          }
          onChangeTab={onChangeTab}
          currentTab={mode}
          tabs={headerTabs}
        />
        <div style={{ height: "100%", overflowY: "scroll" }}>
          {mode === "setup" && (
            <SetupPage
              dataset={dataset}
              onClearLabelData={() => {
                onChangeDataset(
                  setIn(
                    dataset,
                    ["samples"],
                    dataset.samples.map((s) => without(s, "annotation"))
                  )
                )
              }}
              onChange={(newDataset) => {
                const { interface: iface } = newDataset
                if (
                  iface.type !== iface.type &&
                  iface.type !== "empty" &&
                  dataset.samples.map((s) => s.annotation).some(Boolean)
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
              file={file}
              dataset={dataset}
              openSampleLabelEditor={(sampleIndex) => {
                setSampleIndex(sampleIndex)
                posthog.capture("open_sample", {
                  interface_type: iface?.type,
                })
                changeMode("label")
              }}
              openSampleInputEditor={(sampleIndex) => {
                changeSampleInputEditor({ open: true, sampleIndex })
              }}
              deleteSample={(sampleIndex) => {
                const newSamples = [...dataset.samples]
                newSamples.splice(sampleIndex, 1)
                onChangeDataset({
                  ...dataset,
                  samples: newSamples,
                })
              }}
              onChangeFile={(file) => {
                onChangeFile(file)
                setValueDisplay(file.fileName)
              }}
              onChangeDataset={onChangeDataset}
              authConfig={authConfig}
              user={user}
            />
          )}
          {mode === "label" && (
            <LabelView
              selectedBrush={selectedBrush}
              dataset={dataset}
              sampleIndex={sampleIndex}
              onChangeSampleIndex={setSampleIndex}
              sampleTimeToComplete={sampleTimeToComplete}
              onChangeSampleTimeToComplete={changeSampleTimeToComplete}
              onChangeDataset={onChangeDataset}
              onClickSetup={() => changeMode("setup")}
            />
          )}
        </div>
        <EditSampleDialog
          {...sampleInputEditor}
          sampleInput={
            sampleInputEditor.sampleIndex !== undefined
              ? dataset.samples[sampleInputEditor.sampleIndex]
              : null
          }
          onClose={() => {
            changeSampleInputEditor({ open: false })
          }}
          onChange={(newInput) => {
            onChangeDataset(
              setIn(
                dataset,
                ["samples", sampleInputEditor.sampleIndex],
                newInput
              )
            )
          }}
        />
      </div>
    </HotKeys>
  )
}
