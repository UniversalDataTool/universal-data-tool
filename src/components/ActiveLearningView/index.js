import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  fontSize: 18,
  padding: 32,
  textAlign: "center",
  color: colors.grey[700],
  "& a": {
    color: colors.blue[500],
  },
})

export const ActiveLearningView = () => {
  return (
    <Container>
      Hey, this isn't available yet, but if you'd like this functionality please
      let us know by leaving a thumbs up on{" "}
      <a href="https://github.com/UniversalDataTool/universal-data-tool/issues/148">
        this github issue
      </a>
    </Container>
  )
}

export default ActiveLearningView
