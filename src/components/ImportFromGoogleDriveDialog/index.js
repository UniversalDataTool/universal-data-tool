import React, { useState, useEffect } from "react"
import SimpleDialog from "../SimpleDialog"
import Button from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"

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

  const googlePickerActionCallback = (data) => {
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
  }

  const createPicker = () => {
    if (pickerApiLoaded && oauthToken) {
      const view = new window.google.picker.View(
        window.google.picker.ViewId.Docs
      )

      view.setMimeTypes(
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "video/mp4",
        "video/mpeg"
      )
      const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
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
  }

  useEffect(() => {
    createPicker()
  }, [pickerApiLoaded, oauthToken])

  const handleAuthenticationResponse = (authenticationResponse) => {
    if (authenticationResponse && !authenticationResponse.error) {
      setOAuthToken(authenticationResponse.access_token)
      createPicker()
    }
  }

  const onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        client_id: credentials.web.client_id,
        scope: scope,
        immediate: false,
      },
      handleAuthenticationResponse
    )
  }

  const onPickerApiLoad = () => {
    setPickerApiLoaded(true)
    createPicker()
  }

  const onLoadPicker = () => {
    if (googleScriptLoaded === true) {
      window.gapi.load("auth", { callback: onAuthApiLoad })
      window.gapi.load("picker", { callback: onPickerApiLoad })
    }
  }

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
  }, [open, googleScriptLoaded])

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
        Reopen Google Drive Picker
      </Button>
      <ExplainText>
        Make sure your Google Drive files are available via a link.{" "}
        <b>If you don't, the files will not appear when you're labeling!</b>
      </ExplainText>
      <GoogleDriveScreenshot
        src={
          "https://s3.amazonaws.com/asset.workaround.online/google-share-screenshot.png"
        }
      />
    </SimpleDialog>
  )
}
