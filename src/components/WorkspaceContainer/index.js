// @flow

import React, { useMemo } from "react"
import Box from "@material-ui/core/Box"
import Workspace from "react-material-workspace-layout/Workspace"
import { styled } from "@material-ui/core/styles"

const HeaderLeftSideContainer = styled("div")({
  fontSize: 24,
  fontWeight: "bold",
})

export default ({
  children,
  onNext,
  onPrev,
  currentSampleIndex = 0,
  numberOfSamples = 1,
  globalSampleIndex = 1,
  titleContent,
  onClickHeaderItem,
}: any) => {
  const headerItems = useMemo(
    () =>
      [
        (currentSampleIndex > 0 || onPrev) && { name: "Prev", onClick: onPrev },
        (numberOfSamples > currentSampleIndex + 1 || onNext) && {
          name: "Next",
          onClick: onNext,
        },
        { name: "Save" },
      ].filter(Boolean),
    [currentSampleIndex, numberOfSamples, onNext, onPrev]
  )
  return (
    <Workspace
      headerLeftSide={
        titleContent === undefined ? (
          <Box paddingLeft={2} fontWeight="bold">
            <HeaderLeftSideContainer>
              Sample{" "}
              {numberOfSamples > 1
                ? `${currentSampleIndex + 1} / ${numberOfSamples}`
                : `${globalSampleIndex}`}
            </HeaderLeftSideContainer>
          </Box>
        ) : (
          titleContent
        )
      }
      onClickHeaderItem={onClickHeaderItem}
      headerItems={headerItems}
      iconSidebarItems={[]}
      rightSidebarItems={[]}
    >
      <Box padding={2} style={{ width: "100%" }}>
        {children}
      </Box>
    </Workspace>
  )
}
