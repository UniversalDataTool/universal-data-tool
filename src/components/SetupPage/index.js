// @flow weak

import React, { useState } from "react"
import ConfigureInterface from "../ConfigureInterface"
import AdvancedOptionsView from "../AdvancedOptionsView"
import { templateMap } from "../StartingPage/templates"
import Box from "@material-ui/core/Box"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import CategoryIcon from "@material-ui/icons/Category"
import BuildIcon from "@material-ui/icons/Build"
import LiveTvIcon from "@material-ui/icons/LiveTv"
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard"
import CodeIcon from "@material-ui/icons/Code"
import BigInterfaceSelect from "../BigInterfaceSelect"
import { setIn } from "seamless-immutable"
import UniversalDataViewer from "../UniversalDataViewer"
import RawJSONEditor from "../RawJSONEditor"

const noop = () => {}

export default ({ dataset, onChange, onClearLabelData }) => {
  const [currentTab, setTab] = useState(
    dataset.interface.type ? "configure" : "datatype"
  )

  return (
    <div>
      <Box padding="16px">
        <Tabs value={currentTab} onChange={(e, newTab) => setTab(newTab)}>
          <Tab icon={<CategoryIcon />} label="Data Type" value="datatype" />
          <Tab icon={<BuildIcon />} label="Configure" value="configure" />
          <Tab icon={<LiveTvIcon />} label="Preview" value="preview" />
          <Tab icon={<CodeIcon />} label="JSON" value="json" />
          <Tab
            icon={<DeveloperBoardIcon />}
            label="Advanced"
            value="advanced"
          />
        </Tabs>
      </Box>
      {currentTab === "datatype" && (
        <BigInterfaceSelect
          currentInterfaceType={dataset.interface?.type}
          onChange={(newInterface) => {
            onChange(setIn(dataset, ["interface"], newInterface))
            setTab("configure")
          }}
        />
      )}
      {currentTab === "configure" && (
        <ConfigureInterface
          dataset={dataset}
          onChange={(iface) => onChange(setIn(dataset, ["interface"], iface))}
          isNotNested
        />
      )}
      {currentTab === "preview" && (
        <UniversalDataViewer
          height={600}
          onExit={noop}
          onSaveTaskOutputItem={noop}
          dataset={{
            ...dataset,
            samples: dataset?.samples?.length
              ? [dataset.samples[0]]
              : [templateMap[dataset.interface?.type].dataset.samples[0]],
          }}
        />
      )}
      {currentTab === "advanced" && (
        <AdvancedOptionsView onClearLabelData={onClearLabelData} />
      )}
      {currentTab === "json" && (
        <RawJSONEditor
          content={dataset}
          onSave={(newDataset) => {
            onChange(newDataset)
          }}
        />
      )}
    </div>
  )
}
