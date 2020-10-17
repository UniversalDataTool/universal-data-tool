import React, { useState } from "react"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"
import { useAppConfig } from "../AppConfig"
import SaveIcon from "@material-ui/icons/Save"
import CircularProgress from "@material-ui/core/CircularProgress"
import usePosthog from "../../hooks/use-posthog"

const Title = styled("div")({
  fontSize: 18,
  color: colors.grey[800],
  padding: 16,
  "& a": {
    color: colors.blue[600],
  },
})

const LabelHelpIs = styled("div")({
  fontSize: 18,
  lineHeight: 1.5,
  color: colors.grey[800],
  padding: 16,
  width: 800,
})

const ErrorText = styled("div")({
  color: colors.red[600],
})

export default () => {
  const { setInConfig } = useAppConfig()
  const [verifying, setVerifying] = useState(false)
  const [textFieldValue, setTextFieldValue] = useState("")
  const [error, setError] = useState("")
  const posthog = usePosthog()

  return (
    <Box paddingTop={8} textAlign="center">
      <LabelHelpIs>
        Label Help is a UDT-integrated service that crowd-sources your labeling,
        it's about the same speed as having a team of 5-10 full-time labelers.
      </LabelHelpIs>
      <Title>
        To use Label Help, enter your API key. You can{" "}
        <a
          href="https://labelhelp.universaldatatool.com"
          // eslint-disable-next-line
          target="_blank"
          onClick={() => posthog.capture("get_api_key_link_clicked")}
        >
          get an API key here
        </a>
        .
      </Title>
      {error && <ErrorText>{error}</ErrorText>}
      <Box
        paddingTop={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <TextField
          onChange={(e) => setTextFieldValue(e.target.value)}
          className="label-help-api-key-text-field"
          variant="outlined"
          label="API Key"
        />
        <Button
          style={{ marginTop: 16 }}
          color="primary"
          disabled={verifying}
          variant="outlined"
          onClick={async () => {
            setError(null)
            setVerifying(true)
            try {
              // TODO check with labelhelp server and make sure api key is valid
              const response = await fetch(
                "https://labelhelp.universaldatatool.com/api/me",
                {
                  headers: { apikey: textFieldValue },
                }
              )
              if (response.status !== 200) throw new Error(response.toString())
            } catch (e) {
              setError(e.toString())
              setVerifying(false)
              return
            }

            setVerifying(false)
            setInConfig("labelhelp.apikey", textFieldValue)
            posthog.capture("save_api_key_button_clicked")
          }}
        >
          {verifying ? (
            <>
              <CircularProgress size={18} style={{ marginRight: 16 }} />
              Checking...
            </>
          ) : (
            <>
              <SaveIcon style={{ marginRight: 8 }} />
              Save
            </>
          )}
        </Button>
      </Box>
    </Box>
  )
}
