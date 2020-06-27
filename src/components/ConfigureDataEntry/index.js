// @flow

import React, { useRef, useState } from "react"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import CancelIcon from "@material-ui/icons/Cancel"
import TextField from "@material-ui/core/TextField"
import Survey from "material-survey/components/Survey"
import Grid from "@material-ui/core/Grid"
import { setIn } from "seamless-immutable"

import { useTranslation } from "react-i18next"

const ButtonsContainer = styled("div")({
  textAlign: "right",
})
const NoQuestions = styled("div")({
  fontSize: 18,
  color: colors.grey[500],
  fontWeight: "bold",
  textAlign: "center",
  padding: 16,
})

const Question = styled("div")({
  position: "relative",
  padding: 16,
  margin: 16,
  borderLeft: `4px solid ${colors.blue[400]}`,
  // backgroundColor: colors.grey[50],
  borderRadius: 4,
  paddingRight: 64,
  "& .quitButton": {
    position: "absolute",
    right: 4,
    top: 4,
  },
  "& > *": {
    margin: 8,
  },
})
const PreviewHeader = styled("div")({
  fontSize: 12,
  fontWeight: "bold",
  color: colors.grey[600],
  textTransform: "uppercase",
  margin: 16,
  marginBottom: 32,
})

const StyledButton = styled(Button)({
  position: "relative",
  "& .icon": {
    marginRight: 8,
    opacity: 0.7,
  },
})

export default ({ iface, onChange }) => {
  const anchorEl = useRef()
  const [menuOpen, changeMenuOpen] = useState(false)
  const { questions = [] } = iface.surveyjs || {}

  const { t } = useTranslation()

  return (
    <div>
      {questions.length === 0 ? (
        <NoQuestions>No Inputs, Click Add Input Below</NoQuestions>
      ) : (
        questions.map((q, i) => (
          <Question key={i}>
            <div style={{ display: "flex" }}>
              <TextField
                variant="outlined"
                label="Name / Identifier"
                value={q.name || ""}
                onChange={(e) => {
                  onChange(
                    setIn(
                      iface,
                      ["surveyjs", "questions", i, "name"],
                      e.target.value
                    )
                  )
                }}
              />
              <TextField
                style={{ marginLeft: 8, flexGrow: 1 }}
                variant="outlined"
                label="Title / Instruction"
                value={q.title || ""}
                onChange={(e) => {
                  onChange(
                    setIn(
                      iface,
                      ["surveyjs", "questions", i, "title"],
                      e.target.value
                    )
                  )
                }}
              />
            </div>
            <Grid container>
              <Grid item xs={6}>
                {q.choices && (
                  <TextField
                    style={{
                      marginTop: 8,
                      paddingRight: 8,
                      boxSizing: "border-box",
                    }}
                    variant="outlined"
                    fullWidth
                    label="Choices (One per Line)"
                    defaultValue={q.choices.join("\n") || ""}
                    onChange={(e) => {
                      onChange(
                        setIn(
                          iface,
                          ["surveyjs", "questions", i, "choices"],
                          e.target.value.split("\n")
                        )
                      )
                    }}
                    multiline
                    rows={6}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <PreviewHeader>Preview</PreviewHeader>
                <Survey
                  noActions
                  variant="flat"
                  key={q}
                  form={{ questions: [q] }}
                />
              </Grid>
            </Grid>
            <IconButton
              className="quitButton"
              onClick={() => {
                onChange(
                  setIn(
                    iface,
                    ["surveyjs", "questions"],
                    [...questions.slice(0, i), ...questions.slice(i + 1)]
                  )
                )
              }}
            >
              <CancelIcon />
            </IconButton>
          </Question>
        ))
      )}
      <ButtonsContainer>
        <StyledButton onClick={(e) => changeMenuOpen(true)} ref={anchorEl}>
          <AddCircleIcon className="icon" />
          {t("add-input")}
        </StyledButton>
      </ButtonsContainer>
      <Menu
        anchorEl={anchorEl && anchorEl.current}
        open={menuOpen}
        onClose={() => changeMenuOpen(false)}
      >
        <MenuItem
          onClick={() => {
            changeMenuOpen(false)
            onChange(
              setIn(
                iface,
                ["surveyjs", "questions"],
                ((iface.surveyjs || {}).questions || []).concat([
                  {
                    name: "input" + questions.length,
                    type: "text",
                    title: "New Text Input",
                  },
                ])
              )
            )
          }}
        >
          {t("text-input")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            changeMenuOpen(false)
            onChange(
              setIn(
                iface,
                ["surveyjs", "questions"],
                (iface.surveyjs.questions || []).concat({
                  name: "input" + questions.length,
                  type: "radiogroup",
                  title: "New Exclusive Choice Input",
                  choices: ["Yes", "Maybe", "No"],
                })
              )
            )
          }}
        >
          {t("exclusive-choice")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            changeMenuOpen(false)
            onChange(
              setIn(
                iface,
                ["surveyjs", "questions"],
                (iface.surveyjs.questions || []).concat({
                  name: "input" + questions.length,
                  type: "checkbox",
                  title: "New Checkbox Input",
                  choices: ["A", "B", "C"],
                })
              )
            )
          }}
        >
          Checkboxes
        </MenuItem>
        <MenuItem
          onClick={() => {
            changeMenuOpen(false)
            onChange(
              setIn(
                iface,
                ["surveyjs", "questions"],
                iface.surveyjs.questions.concat({
                  name: "input" + questions.length,
                  type: "boolean",
                  title: "New Boolean Input",
                })
              )
            )
          }}
        >
          Boolean
        </MenuItem>
        <MenuItem
          onClick={() => {
            changeMenuOpen(false)
            onChange(
              setIn(
                iface,
                ["surveyjs", "questions"],
                (iface.questions || []).concat({
                  name: "input" + questions.length,
                  type: "dropdown",
                  title: "New Dropdown Input",
                  choices: ["A", "B", "C"],
                })
              )
            )
          }}
        >
          {t("drop-down-autocomplete")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            changeMenuOpen(false)
            onChange(
              setIn(
                iface,
                ["surveyjs", "questions"],
                iface.surveyjs.questions.concat([
                  {
                    name: "input" + questions.length,
                    type: "multiple-dropdown",
                    title: "New Multiple Dropdown Input",
                    choices: ["A", "B", "C"],
                  },
                ])
              )
            )
          }}
        >
          {t("multiple-item-dropdown-autocomplete")}
        </MenuItem>
      </Menu>
    </div>
  )
}
