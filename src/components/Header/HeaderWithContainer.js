import React from "react"
import { styled } from "@material-ui/core/styles"
import { Header } from "./"

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
})
const Body = styled("div")({
  display: "flex",
})
const Content = styled("div")({
  flexGrow: 1,
})

export const HeaderWithContainer = (props) => {
  return (
    <Container>
      <Body>
        <Header {...props} children={null} />
        <Content>{props.children}</Content>
      </Body>
    </Container>
  )
}

export default HeaderWithContainer
