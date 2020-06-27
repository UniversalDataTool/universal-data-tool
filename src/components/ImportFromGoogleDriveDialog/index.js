import React, { useState, useEffect, useCallback } from "react"
import SimpleDialog from "../SimpleDialog"
import Button from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const ExplainText = styled("div")({
  marginTop: 8,
  marginBottom: 8,
})
const GoogleDriveScreenshot = styled("img")({
  width: "100%",
  boxSizing: "border-box",
})

// Example for Google OAuth
// https://developers.google.com/drive/api/v3/picker

const credentials = {
  web: {
    client_id:
      process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ||
      "294393711342-h5aqqt3pvn8othepvsmi16iakdhi7m6j.apps.googleusercontent.com",
    app_id: process.env.REACT_APP_GOOGLE_DRIVE_APP_ID || "294393711342",
    developer_key:
      process.env.REACT_APP_GOOGLE_DRIVE_DEVELOPER_KEY ||
      "AIzaSyCoNoDnfzDBSXpt84Q75LU9UMTzvyLkRhg",
  },
}

const scope = "https://www.googleapis.com/auth/drive.readonly"

export default ({ open, onClose, onAddSamples }) => {
  const { t } = useTranslation()
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false)
  const [oauthToken, setOAuthToken] = useState(null)
  const [userSelectedItemsFromDrive, setUserSelectedItemsFromDrive] = useState(
    []
  )
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  useEffect(() => {
    const scriptElement = document.createElement("script")
    scriptElement.src = "https://apis.google.com/js/api.js"
    scriptElement.async = true

    scriptElement.onload = () => {
      setGoogleScriptLoaded(true)
    }

    document.body.appendChild(scriptElement)
    return () => {
      scriptElement.remove()
    }
  }, [])

  const googlePickerActionCallback = useCallback(
    (data) => {
      if (data.action === window.google.picker.Action.PICKED) {
        setUserSelectedItemsFromDrive(
          data.docs.map((googleDriveDocument) => ({
            url: googleDriveDocument.url,
            mimeType: googleDriveDocument.mimeType,
            name: googleDriveDocument.name,
            id: googleDriveDocument.id,
          }))
        )

        setIsPickerOpen(false)
      } else if (data.action === "cancel") {
        onClose()
      }
    },
    [onClose]
  )

  const createPicker = useCallback(() => {
    if (pickerApiLoaded && oauthToken) {
      const view = new window.google.picker.DocsView(
        window.google.picker.ViewId.Docs,
        window.google.picker.ViewId.FOLDERS
      )
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true)

      const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .enableFeature(window.google.picker.Feature.MINE_ONLY)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(credentials.web.app_id)
        .setOAuthToken(oauthToken)
        .addView(view)
        .addView(window.google.picker.ViewId.DOCS)
        .setDeveloperKey(credentials.web.developer_key)
        .setCallback(googlePickerActionCallback)
        .build()
      picker.setVisible(true)
      setIsPickerOpen(true)
    }
  }, [googlePickerActionCallback, oauthToken, pickerApiLoaded])

  useEffect(() => {
    createPicker()
  }, [pickerApiLoaded, oauthToken, createPicker])

  const handleAuthenticationResponse = useCallback(
    (authenticationResponse) => {
      if (authenticationResponse && !authenticationResponse.error) {
        setOAuthToken(authenticationResponse.access_token)
        createPicker()
      }
    },
    [createPicker]
  )

  const onAuthApiLoad = useCallback(() => {
    window.gapi.auth.authorize(
      {
        client_id: credentials.web.client_id,
        scope: scope,
        immediate: false,
      },
      handleAuthenticationResponse
    )
  }, [handleAuthenticationResponse])

  const onPickerApiLoad = useCallback(() => {
    setPickerApiLoaded(true)
    createPicker()
  }, [createPicker])

  const onLoadPicker = useCallback(() => {
    if (googleScriptLoaded === true) {
      window.gapi.load("auth", { callback: onAuthApiLoad })
      window.gapi.load("picker", { callback: onPickerApiLoad })
    }
  }, [googleScriptLoaded, onAuthApiLoad, onPickerApiLoad])

  const onAddSamplesClicked = () => {
    const samples = []
    for (const item of userSelectedItemsFromDrive) {
      if (item.mimeType.includes("image/")) {
        samples.push({ imageUrl: `https://drive.google.com/uc?id=${item.id}` })
      } else if (item.mimeType.includes("video/")) {
        samples.push({ videoUrl: `https://drive.google.com/uc?id=${item.id}` })
      }
    }

    onAddSamples(samples)
  }

  useEffect(() => {
    if (open) {
      onLoadPicker()
    }
  }, [open, googleScriptLoaded, onLoadPicker])

  return (
    <SimpleDialog
      open={open && !isPickerOpen}
      onClose={onClose}
      title="Import from Google Drive"
      actions={[
        userSelectedItemsFromDrive &&
          userSelectedItemsFromDrive.length > 0 && {
            text: `Add ${userSelectedItemsFromDrive.length} Samples`,
            onClick: onAddSamplesClicked,
          },
      ].filter(Boolean)}
    >
      <Button variant="outlined" onClick={onLoadPicker}>
        {t("reopen-google-drive-picker")}
      </Button>
      <ExplainText>
        {t("import-from-google-drive-explanation-text")}.{" "}
        <b>{t("import-from-google-drive-explanation-bold-text")}!</b>
      </ExplainText>
      <GoogleDriveScreenshot
        src={
          "https://s3.amazonaws.com/asset.workaround.online/google-share-screenshot.png"
        }
      />
    </SimpleDialog>
  )
}
