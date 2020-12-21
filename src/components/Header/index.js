// @flow weak

import React, { useState, createContext, useContext, useCallback } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import LoginDrawer from "../LoginDrawer"
import CollaborativeDatasetManager from "udt-dataset-managers/dist/CollaborationServerDatasetManager"
import LocalStorageDatasetManager from "udt-dataset-managers/dist/LocalStorageDatasetManager"
import useEventCallback from "use-event-callback"
import { useAppConfig } from "../AppConfig"
import HeaderWithContainer from "./HeaderWithContainer"

import HeaderToolbar from "../HeaderToolbar"
import HeaderDrawer from "../HeaderDrawer"

import useOpenTemplate from "../../hooks/use-open-template"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"

export const HeaderContext = createContext({
  recentItems: [],
  changeRecentItems: () => null,
  onClickTemplate: () => null,
  onClickHome: () => null,
  onOpenFile: () => null,
  onOpenRecentItem: () => null,
  isDesktop: false,
  sessionBoxOpen: false,
  changeSessionBoxOpen: () => null,
  fileOpen: false,
  onDownload: () => null,
  authConfig: null,
  onUserChange: () => null,
  user: null,
  logoutUser: () => null,
})

const emptyArray = []

export const Header = ({
  additionalButtons = emptyArray,
  title,
  currentTab,
  onChangeTab,
  tabs = emptyArray,
}) => {
  const [drawerOpen, changeDrawerOpen] = useState(false)
  const [loginDrawerOpen, changeLoginDrawerOpen] = useState(false)
  const { fromConfig } = useAppConfig()
  let headerContext = useContext(HeaderContext)
  const openTemplate = useOpenTemplate()
  if (!headerContext.recentItems) headerContext.recentItems = []

  const isSmall = useMediaQuery("(max-width: 800px)")

  const onOpenDrawer = useCallback(() => changeDrawerOpen(true), [])
  const onCloseDrawer = useCallback(() => changeDrawerOpen(false), [])
  const [dm, setActiveDatasetManager] = useActiveDatasetManager()
  const onCreateSession = useEventCallback(async () => {
    const previousUDTJSON = dm
      ? await dm.getDataset()
      : { interface: {}, samples: [] }
    const newDM = new CollaborativeDatasetManager({
      serverUrl: fromConfig("collaborationServer.url"),
    })
    try {
      await newDM.setDataset(previousUDTJSON)
    } catch (e) {
      console.log(`Couldn't create collaborative session: ${e.toString()}`)
    }
    window.history.replaceState(
      null,
      null,
      `?s=${encodeURIComponent(newDM.sessionId)}`
    )
    setActiveDatasetManager(newDM)
  })

  const onJoinSession = useEventCallback(async (sessionId) => {
    const sessionUrl = new URL(sessionId)
    async function goIntoCollaborativeSession(sessionId) {
      const dm = new CollaborativeDatasetManager({
        serverUrl: fromConfig("collaborationServer.url"),
      })
      await dm.loadSession(sessionId)
      window.history.replaceState(
        null,
        null,
        `?s=${encodeURIComponent(dm.sessionId)}`
      )
      setActiveDatasetManager(dm)
    }
    if (sessionUrl.searchParams.get("s")) {
      goIntoCollaborativeSession(sessionUrl.searchParams.get("s"))
    }
  })

  const onLeaveSession = useEventCallback(async () => {
    if (dm) {
      const ds = await dm.getDataset()
      const newDM = new LocalStorageDatasetManager()
      await newDM.setDataset(ds)
      setActiveDatasetManager(newDM)
    }
  })

  return (
    <>
      <HeaderToolbar
        key="headerToolbar"
        tabs={tabs}
        currentTab={currentTab}
        onChangeTab={onChangeTab}
        additionalButtons={additionalButtons}
        onOpenDrawer={onOpenDrawer}
        isSmall={isSmall}
        {...headerContext}
        inSession={dm && dm.type === "collaborative-session"}
        onJoinSession={onJoinSession}
        onCreateSession={onCreateSession}
        onLeaveSession={onLeaveSession}
        changeLoginDrawerOpen={changeLoginDrawerOpen}
        title={title}
      />
      <HeaderDrawer
        key="headerDrawer"
        drawerOpen={drawerOpen}
        onCloseDrawer={onCloseDrawer}
        onClickHome={headerContext.onClickHome}
        onClickManagePlugins={headerContext.onClickManagePlugins}
        recentItems={headerContext.recentItems}
        changeRecentItems={headerContext.changeRecentItems}
        onOpenFile={headerContext.onOpenFile}
        onClickTemplate={openTemplate}
        onOpenRecentItem={headerContext.onOpenRecentItem}
      />
      <LoginDrawer
        key="loginDrawer"
        authConfig={headerContext.authConfig}
        loginDrawerOpen={loginDrawerOpen}
        onClose={() => changeLoginDrawerOpen(false)}
        onUserChange={headerContext.onUserChange}
        logoutUser={headerContext.logoutUser}
      />
    </>
  )
}

export { HeaderWithContainer }

export default Header
