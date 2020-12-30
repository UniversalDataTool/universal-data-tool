import React, { useEffect } from "react"
import { styled, colors, TextField, Button, Box } from "@material-ui/core"
import { useRecoilState, atom } from "recoil"

const Title = styled("div")({
  marginTop: 24,
  color: colors.grey[500],
  fontSize: 24,
})

const StyledTextField = styled(TextField)({
  "&.MuiTextField-root": {
    marginTop: 12,
  },
  "& .MuiInputLabel-formControl": {
    color: colors.grey[500],
  },
  "& .MuiInputBase-input": {
    color: colors.grey[100],
  },
})

const StyledButton = styled(Button)({
  color: colors.grey[500],
})

const loginState = atom({
  key: "loginState",
  default: {
    loggedIn: false,
  },
})

const DatasetRow = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  color: colors.grey[600],
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: colors.grey[400],
  },
  cursor: "pointer",
})
const DatasetCol = styled("div")({
  display: "flex",
  padding: 8,
  flexShrink: 0,
  flexGrow: 1,
  flexBasis: 1,
  fontSize: 14,
  textAlign: "left",
  alignItems: "flex-end",
  "&:last-child": {
    color: colors.grey[700],
    textAlign: "right",
    fontSize: 12,
    justifyContent: "flex-end",
  },
})

export const PremiumWelcomeSidebarElement = () => {
  const [login, setLoginState] = useRecoilState(loginState)

  if (!login.loggedIn) {
    return (
      <Box width="280px" paddingTop="32px">
        <StyledTextField variant="filled" label="Username" />
        <StyledTextField variant="filled" type="password" label="Password" />
        <Box display="flex" justifyContent="flex-end" marginTop="12px">
          <StyledButton variant="filled">Login</StyledButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box paddingTop="32px">
      <Title>Datasets</Title>
      <Box paddingTop="16px">
        <DatasetRow>
          <DatasetCol>Dataset 1</DatasetCol>
          <DatasetCol>16,789 Samples</DatasetCol>
          <DatasetCol>3 hours ago</DatasetCol>
        </DatasetRow>
        <DatasetRow>
          <DatasetCol>Dataset 2</DatasetCol>
          <DatasetCol>531 Samples</DatasetCol>
          <DatasetCol>12 hours ago</DatasetCol>
        </DatasetRow>
        <DatasetRow>
          <DatasetCol>Dataset 3</DatasetCol>
          <DatasetCol>6,542 Samples</DatasetCol>
          <DatasetCol>5 weeks ago</DatasetCol>
        </DatasetRow>
      </Box>
    </Box>
  )
}

export default PremiumWelcomeSidebarElement
