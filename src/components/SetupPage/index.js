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
import UniversalSampleEditor from "../UniversalSampleEditor"
import DatasetJSONEditor from "../DatasetJSONEditor"
import useInterface from "../../hooks/use-interface"
import useSample from "../../hooks/use-sample"
import Protip from "./Protip"

const noop = () => {}

export default ({ onClearLabelData }) => {
  const { iface, updateInterface } = useInterface()
  const { sample } = useSample(0)
  const [currentTab, setTab] = useState(iface?.type ? "configure" : "datatype")

  return (
    <div>
      <Box padding="8px" paddingBottom="0px">
        <Tabs value={currentTab} onChange={(e, newTab) => setTab(newTab)}>
          <Tab icon={<CategoryIcon />} label="Data Type" value="datatype" />
          <Tab
            disabled={!iface?.type}
            icon={<BuildIcon />}
            label="Configure"
            value="configure"
          />
          <Tab
            disabled={!iface?.type}
            icon={<LiveTvIcon />}
            label="Preview"
            value="preview"
          />
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
          key="interfaceSelect"
          currentInterfaceType={iface?.type}
          onChange={async (newInterface) => {
            await updateInterface(newInterface)
            setTab("configure")
          }}
        />
      )}
      {currentTab === "configure" && (
        <>
          <ConfigureInterface
            key="configureInterface"
            interface={iface}
            onChange={updateInterface}
            isNotNested
          />
          <Box textAlign="center">
            <Protip tip="All done? Try clicking the Samples icon on the dark sidebar on the left to import samples!" />
          </Box>
        </>
      )}
      {currentTab === "preview" && (
        <UniversalSampleEditor
          key="preview"
          height={600}
          onExit={noop}
          onModifySample={noop}
          interface={iface}
          sampleIndex={0}
          sample={sample || templateMap[iface?.type].dataset.samples[0]}
        />
      )}
      {currentTab === "advanced" && (
        <AdvancedOptionsView
          key="advancedOptionsView"
          onClearLabelData={onClearLabelData}
        />
      )}
      {currentTab === "json" && <DatasetJSONEditor />}
    </div>
  )
}
