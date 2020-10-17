import React from "react"
import ConfigureInterface from "../ConfigureInterface"
import { styled } from "@material-ui/core/styles"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"
import { setIn } from "seamless-immutable"

import { useTranslation } from "react-i18next"

const Fields = styled("div")({})
const StyledExpansionPanel = styled(ExpansionPanel)({
  marginTop: 16,
  border: "2px solid #000",
})
const StyledButton = styled(Button)({
  width: "100%",
  margin: 16,
  marginLeft: 0,
})

export default ({ iface, onChange }) => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Fields>
        {(iface.fields || []).map((f, fieldIndex) => (
          <StyledExpansionPanel key={fieldIndex}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              {f.fieldName}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Box display="flex" flexDirection="column">
                <TextField
                  label="Field Name"
                  value={f.fieldName}
                  onChange={(e) => {
                    onChange(
                      setIn(
                        ["fields", fieldIndex, "fieldName"],
                        e.target.value,
                        iface
                      )
                    )
                  }}
                />
                <ConfigureInterface
                  isNested
                  interface={f.interface}
                  onChange={(newFieldInterface) => {
                    onChange({
                      ...iface,
                      fields: iface.fields.map((field) =>
                        field.fieldName === f.fieldName
                          ? { ...f, interface: newFieldInterface }
                          : field
                      ),
                    })
                  }}
                />
                <Button
                  onClick={() => {
                    onChange({
                      ...iface,
                      fields: iface.fields.filter(
                        ({ fieldName }) => fieldName !== f.fieldName
                      ),
                    })
                  }}
                >
                  {t("remove-field")}
                </Button>
              </Box>
            </ExpansionPanelDetails>
          </StyledExpansionPanel>
        ))}
        <StyledButton
          onClick={() => {
            onChange(
              setIn(
                iface,
                ["fields"],
                (iface.fields || []).concat({
                  fieldOrder: (iface.fields || []).length,
                  fieldName: "New Field",
                  interface: {
                    type: "empty",
                  },
                })
              )
            )
          }}
        >
          {t("add-new-field")}
        </StyledButton>
      </Fields>
    </React.Fragment>
  )
}
