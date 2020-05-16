// @flow weak

import React from "react"
import ConfigureInterface, { Heading } from "../ConfigureInterface"
import PaperContainer from "../PaperContainer"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AdvancedOptionsView from "../AdvancedOptionsView"

export default ({ dataset, onChange, onClickEditJSON, onClearLabelData }) => {
  const { interface: iface } = dataset

  return (
    <div>
      <ConfigureInterface
        iface={iface}
        onChange={onChange}
        onClickEditJSON={onClickEditJSON}
        isNotNested
      />
      <PaperContainer>
        <Heading>Advanced</Heading>
        <AdvancedOptionsView
          onClearLabelData={onClearLabelData}
          onClickEditJSON={onClickEditJSON}
        />
      </PaperContainer>
    </div>
  )
}
