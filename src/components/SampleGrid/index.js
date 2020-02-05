// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import range from "lodash/range"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  flexWrap: "wrap"
})
const Sample = styled("div")({
  margin: 4,
  padding: 4,
  backgroundColor: colors.grey[300],
  display: "inline-flex",
  fontSize: 11,
  textAlign: "center",
  justifyContent: "center",
  minWidth: "3em",
  borderRadius: 3,
  cursor: "pointer",
  "&.completed": {
    backgroundColor: colors.blue[500],
    color: "#fff"
  }
})

export default ({ count, completed = [], onClick }) => {
  return (
    <Container>
      {range(count).map(i => (
        <Sample
          onClick={() => onClick(i)}
          className={completed[i] ? "completed" : ""}
          key={i}
        >
          {i}
        </Sample>
      ))}
    </Container>
  )
}
