// @flow
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import useFileHandler from "../../utils/file-handlers"
import download from "in-browser-download"
import toUDTCSV from "../../utils/to-udt-csv.js"
import Amplify, { Auth, Storage } from "aws-amplify"
import config from "../LocalStorageApp/AWSconfig"
import isEmpty from "../../utils/isEmpty"
import fileHasChanged from "../../utils/fileHasChanged"
import { setIn } from "seamless-immutable"
import AppErrorBoundary from "../AppErrorBoundary"
import useEventCallback from "use-event-callback"
import usePreventNavigation from "../../utils/use-prevent-navigation"
import UpdateAWSStorage from "../../utils/file-handlers/update-aws-storage"

const useStyles = makeStyles({
  empty: {
    textAlign: "center",
    padding: 100,
    color: "#666",
    fontSize: 28,
  },
})

const randomId = () => Math.random().toString().split(".")[1]

export default () => {
  const c = useStyles()
  const {
    file,
    changeFile,
    openFile,
    openUrl,
    makeSession,
    recentItems,
    changeRecentItems,
  } = useFileHandler()
  usePreventNavigation(Boolean(file))
  const [errors, addError] = useErrors()

  const [selectedBrush, setSelectedBrush] = useState("complete")

  const onCreateTemplate = useEventCallback((template) => {
    changeFile({
      fileName: "unnamed",
      content: template.oha,
      id: randomId(),
      mode: "local-storage",
    })
  })

  const openRecentItem = useEventCallback((item) => changeFile(item))
  const onClickHome = useEventCallback(() => changeFile(null))
  const onDownload = useEventCallback((format) => {
    if (!file) return
    const outputName = (file.sessionId || file.fileName) + ".udt." + format
    if (format === "json") {
      download(JSON.stringify(file.content), outputName)
    } else if (format === "csv") {
      download(toUDTCSV(file.content), outputName)
    }
  })

  const inSession = file && file.mode === "server"
  const [sessionBoxOpen, changeSessionBoxOpen] = useState(false)
  const [authConfig, changeAuthConfig] = useState(null)
  const [user, changeUser] = useState(null)

  const logoutUser = () => {
    Auth.signOut()
      .then(() => {
        changeUser(null)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (isEmpty(user) && isEmpty(authConfig)) {
      try {
        Amplify.configure(config)

        Auth.currentAuthenticatedUser()
          .then((tryUser) => {
            changeUser(tryUser)
            changeAuthConfig(config)
          })
          .catch((err) => {
            changeAuthConfig(config)
          })
      } catch (err) {
        changeAuthConfig(null)
      }
    }
  }, [])

  const onJoinSession = useCallback(async (sessionName) => {
    await openUrl(sessionName)
  }, [])

  const onLeaveSession = useEventCallback(() =>
    changeFile({
      ...file,
      mode: "local-storage",
      fileName: file.fileName || `copy_of_${file.id}`,
    })
  )

  const lastObjectRef = useRef([])
  useEffect(() => {
    if (!isEmpty(authConfig)) {
      var changes = fileHasChanged(lastObjectRef.current, file)
      if (
        (!changes.content.taskData &&
          !changes.content.taskOutput &&
          !changes.fileName) ||
        (file.content.interface.type !== "video_segmentation" &&
          file.content.interface.type !== "image_classification" &&
          file.content.interface.type !== "image_segmentation")
      )
        return
      lastObjectRef.current = file
      UpdateAWSStorage(file)
    }
  }, [recentItems])

  return (
    <>
      <HeaderContext.Provider
        value={{
          title: file
            ? file.mode === "local-storage"
              ? file.fileName
              : file.url
            : "unnamed",
          recentItems,
          changeRecentItems,
          onClickTemplate: onCreateTemplate,
          onClickHome,
          onOpenFile: openFile,
          onOpenRecentItem: openRecentItem,
          inSession,
          sessionBoxOpen,
          changeSessionBoxOpen,
          onJoinSession,
          onLeaveSession,
          onCreateSession: makeSession,
          fileOpen: Boolean(file),
          onDownload,
          authConfig,
          onUserChange: (userToSet) => changeUser(userToSet),
          user: user,
          logoutUser: logoutUser,
          onChangeSelectedBrush: setSelectedBrush,
          selectedBrush,
        }}
      >
        {!file ? (
          <StartingPage
            onFileDrop={openFile}
            onOpenTemplate={onCreateTemplate}
            recentItems={recentItems}
            onOpenRecentItem={openRecentItem}
            onClickOpenSession={() => changeSessionBoxOpen(true)}
            onAuthConfigured={(config) => changeAuthConfig(config)}
            user={user}
            logoutUser={logoutUser}
          />
        ) : (
          <AppErrorBoundary>
            <OHAEditor
              file={file}
              key={file.id}
              {...file}
              selectedBrush={selectedBrush}
              inSession={inSession}
              oha={file.content}
              onChangeOHA={(newOHA) => {
                changeFile(setIn(file, ["content"], newOHA))
              }}
              onChangeFile={changeFile}
              authConfig
              user={user}
              recentItems={recentItems}
            />
          </AppErrorBoundary>
        )}
      </HeaderContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
