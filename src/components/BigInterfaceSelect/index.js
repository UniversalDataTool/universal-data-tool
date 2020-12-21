import React from "react"
import templates from "../StartingPage/templates"
import Button from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  padding: 24,
  boxSizing: "border-box",
  "&.emptyState": {
    textAlign: "center",
    backgroundColor: colors.blue[800],
    minHeight: "85vh",
    padding: 64,
    "& .bigText": {
      textAlign: "left",
      fontSize: 48,
      color: "#fff",
      fontWeight: "bold",
      marginBottom: 48,
    },
  },
})

const BigButton = styled(Button)({
  padding: 10,
  width: 200,
  height: 150,
  boxShadow: "0px 3px 5px rgba(0,0,0,0.3)",
  margin: 12,
  "& .bigIcon": {
    marginTop: 16,
    width: 64,
    height: 64,
  },
  transition: "transform 100ms",
  "&:hover": {
    backgroundColor: "#fff",
    transform: "scale(1.04,1.04)",
  },
  backgroundColor: colors.blue[100],
  "&.selected": {
    backgroundColor: "#fff",
  },
})

export const BigInterfaceSelect = ({ onChange, currentInterfaceType }) => {
  return (
    <Container className="emptyState">
      <div className="bigText">Choose an Interface:</div>
      {templates
        .filter((t) => t.name !== "Empty")
        .map((template) => (
          <BigButton
            key={template.name}
            className={
              currentInterfaceType === template.dataset.interface.type
                ? "selected"
                : ""
            }
            disabled={currentInterfaceType === template.dataset.interface.type}
            onClick={() => onChange(template.dataset.interface)}
          >
            <div>
              <div>{template.name}</div>
              <div>
                <template.Icon className="bigIcon" />
              </div>
            </div>
          </BigButton>
        ))}
    </Container>
  )
}

export default BigInterfaceSelect
