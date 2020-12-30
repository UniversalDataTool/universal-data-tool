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

  return <div>{/* asd */}</div>
}

export default PremiumWelcomeSidebarElement
