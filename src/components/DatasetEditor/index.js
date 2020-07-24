// @flow

import React, { useState, useEffect, useMemo } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Header from "../Header"
import EditableTitleText from "./EditableTitleText.js"
import SamplesView from "../SamplesView"
import InterfacePage from "../InterfacePage"
import EditSampleDialog from "../EditSampleDialog"
import useElectron from "../../utils/use-electron"
import useTimeToCompleteSample from "../../utils/use-time-to-complete-sample.js"
import TextField from "@material-ui/core/TextField"
import { useToasts } from "../Toasts"
import { setIn, without } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import usePosthog from "../../utils/use-posthog"
import classnames from "classnames"
import LabelView from "../LabelView"
import useIsLabelOnlyMode from "../../utils/use-is-label-only-mode"
import { HotKeys } from "react-hotkeys"
import { useHotkeyStorage } from "../HotkeyStorage"
import RawJSONEditor from "../RawJSONEditor"

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
  const [singleSampleDataset, setSingleSampleDataset] = useState()
  const [sampleInputEditor, changeSampleInputEditor] = useState({})
  const { ipcRenderer } = useElectron() || {}
  const posthog = usePosthog()

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
    if (mode !== "label") {
      setSingleSampleDataset(null)
    }
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
          {mode === "json" && (
            <RawJSONEditor
              content={dataset}
              onSave={(newDataset) => {
                onChangeDataset(newDataset)
                changeMode("setup")
              }}
            />
          )}
          {mode === "setup" && (
            <InterfacePage
              onClickEditJSON={() => changeMode("json")}
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
              onChange={(iface) => {
                if (
                  iface.type !== dataset.interface.type &&
                  dataset.interface.type !== "empty" &&
                  dataset.samples.map((s) => s.annotation).some(Boolean)
                ) {
                  addToast(
                    "Changing label types can cause label data issues. You must clear all label data first.",
                    "error"
                  )
                  return
                }
                onChangeDataset({
                  ...dataset,
                  interface: iface,
                })
              }}
            />
          )}
          {mode === "samples" && (
            <SamplesView
              file={file}
              dataset={dataset}
              openSampleLabelEditor={(sampleIndex) => {
                setSingleSampleDataset({
                  ...dataset,
                  samples: [dataset.samples[sampleIndex]],
                  sampleIndex,
                  annotationStartTime: Date.now(),
                })
                posthog.capture("open_sample", {
                  interface_type: dataset.interface.type,
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
              sampleTimeToComplete={sampleTimeToComplete}
              onChangeSampleTimeToComplete={changeSampleTimeToComplete}
              onChangeDataset={onChangeDataset}
              singleSampleDataset={singleSampleDataset}
              onChangeSingleSampleDataset={setSingleSampleDataset}
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
