import React from "react"
import { styled } from "@material-ui/core/styles"
import { colors } from "@material-ui/core"
import { Header } from "./"

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
})
const Body = styled("div")({
  display: "flex",
})
const Title = styled("div")({
  backgroundColor: colors.grey[900],
  padding: 8,
  color: colors.grey[300],
  "&::first-letter": {
    textTransform: "uppercase",
  },
})
const Content = styled("div")({
  flexGrow: 1,
})

export const HeaderWithContainer = (props) => {
  return (
    <Container>
      {props.currentTab && <Title>{props.currentTab}</Title>}
      <Body>
        <Header {...props} children={null} />
        <Content>{props.children}</Content>
      </Body>
    </Container>
  )
}

export default HeaderWithContainer
