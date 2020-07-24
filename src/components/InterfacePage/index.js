// @flow weak

import React from "react"
import ConfigureInterface, { Heading } from "../ConfigureInterface"
import PaperContainer from "../PaperContainer"
import AdvancedOptionsView from "../AdvancedOptionsView"

export default ({ dataset, onChange, onClickEditJSON, onClearLabelData }) => {
  return (
    <div>
      <ConfigureInterface
        dataset={dataset}
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
