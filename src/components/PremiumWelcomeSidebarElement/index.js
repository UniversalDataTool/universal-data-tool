import React, { useEffect } from "react"
import {
  styled,
  colors,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core"
import { useRecoilState, useSetRecoilState, atom } from "recoil"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"
import LocalStorageDatasetManager from "udt-dataset-managers/dist/LocalStorageDatasetManager"
import {
  useLogin,
  useDatasets,
  activeDatasetAtom,
} from "udt-premium-api-hook-lib"

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
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const {
    login,
    logout,
    loginError,
    isLoggedIn,
    loading: loginLoading,
  } = useLogin()
  const { datasets } = useDatasets()
  const setActiveDataset = useSetRecoilState(activeDatasetAtom)
  const [, setActiveDatasetManager] = useActiveDatasetManager()

  if (loginLoading)
    return (
      <Box
        width="100%"
        paddingTop="32px"
        justifyContent="center"
        alignItems="center"
        display="flex"
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    )

  if (!isLoggedIn) {
    return (
      <Box width="280px" paddingTop="32px">
        {loginError && <Box color="red">{loginError}</Box>}
        <StyledTextField
          onChange={(e) => setEmail(e.target.value)}
          variant="filled"
          label="Email"
        />
        <StyledTextField
          onChange={(e) => setPassword(e.target.value)}
          variant="filled"
          type="password"
          label="Password"
        />
        <Box display="flex" justifyContent="flex-end" marginTop="12px">
          <StyledButton
            onClick={() => login({ email, password })}
            variant="filled"
          >
            Login
          </StyledButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box paddingTop="32px">
      <Title>Datasets</Title>
      <Box paddingTop="16px">
        {(datasets || []).map((ds) => (
          <DatasetRow
            onClick={() => {
              setActiveDataset(ds)
              const dm = new LocalStorageDatasetManager()
              dm.setDataset({
                interface: {},
                samples: [],
                dataset_id: ds.dataset_id,
              })
              setActiveDatasetManager(dm)
            }}
            key={ds.dataset_id}
          >
            <DatasetCol>{ds.display_name}</DatasetCol>
            <DatasetCol>{ds.num_samples} Samples</DatasetCol>
            <DatasetCol>{ds.last_activity}</DatasetCol>
          </DatasetRow>
        ))}
      </Box>
      <Box display="flex" justifyContent="flex-end" marginTop="12px">
        <StyledButton onClick={() => logout()} variant="filled">
          Sign Out
        </StyledButton>
      </Box>
    </Box>
  )
}

export default PremiumWelcomeSidebarElement
