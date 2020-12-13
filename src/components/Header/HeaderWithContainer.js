import React from "react"
import { styled } from "@material-ui/core/styles"
import { colors } from "@material-ui/core"
import { Header } from "./"

const Container = styled("div")({
  display: "flex",
})

const RightOfHeader = styled("div")({})

export const HeaderWithContainer = (props) => {
  return (
    <Container>
      <Header {...props} children={null} />
      <RightOfHeader>{props.children}</RightOfHeader>
    </Container>
  )
}

export default HeaderWithContainer
